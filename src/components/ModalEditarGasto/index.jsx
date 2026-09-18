import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Titulos } from "../Card";
import { parseCurrency } from "../../utils/currencyUtils";
import { CATEGORIAS_PADRAO, normalizarCategoria } from "../../utils/categoriasGasto";

export default function ModalEditarGasto({ gasto, onClose, onUpdate, onDelete }) {
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

    // Formata o valor inicial para exibição amigável (com vírgula)
    const valorInicial = gasto?.valor !== undefined
        ? String(gasto.valor).includes(",")
            ? String(gasto.valor)
            : Number(gasto.valor).toFixed(2).replace(".", ",")
        : "";

    const { categoriaSelecionada: catInit, categoriaPersonalizada: catPersInit } =
        normalizarCategoria(gasto?.categoria);

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            data: gasto?.data || "",
            valor: valorInicial,
            responsavel: gasto?.responsavel || "meu",
            tipo: gasto?.tipo || "Desejo",
            categoria: catInit,
            categoriaPersonalizada: catPersInit,
            cartao: gasto?.cartao || "Nubank",
        },
    });

    const valorWatch = watch("valor");
    const responsavelWatch = watch("responsavel");
    const categoriaWatch = watch("categoria");
    const valorNumerico = parseCurrency(valorWatch);

    const handleFormSubmit = async (data) => {
        let categoriaFinal = data.categoria;
        if (data.categoria === "OUTRO") {
            categoriaFinal = data.categoriaPersonalizada?.trim() || "Outros";
        }

        const dadosAtualizados = {
            ...gasto,
            ...data,
            categoria: categoriaFinal,
            valor: parseCurrency(data.valor),
        };
        delete dadosAtualizados.categoriaPersonalizada;

        await onUpdate(gasto.id, dadosAtualizados);
        onClose();
    };

    const handleExcluir = async () => {
        if (!confirmandoExclusao) {
            setConfirmandoExclusao(true);
            return;
        }
        await onDelete(gasto.id);
        onClose();
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <Header>
                    <div>
                        <Titulos className="titulo">Editar Gasto</Titulos>
                        {gasto?.parcela && (
                            <SubinfoParcela>
                                Parcela {gasto.parcela}
                            </SubinfoParcela>
                        )}
                    </div>
                    <CloseButton type="button" onClick={onClose}>
                        &times;
                    </CloseButton>
                </Header>

                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <label>Data</label>
                    <input
                        type="date"
                        {...register("data", { required: true })}
                    />

                    <label>Valor (R$)</label>
                    <input
                        type="text"
                        placeholder="R$ 0,00"
                        {...register("valor", { required: true })}
                    />

                    <label>Responsável pelo Gasto</label>
                    <select {...register("responsavel")}>
                        <option value="meu">Meu (Próprio)</option>
                        <option value="mozi">Mozi (100% Reembolsável)</option>
                        <option value="dividido">Dividido (50% cada)</option>
                    </select>

                    {responsavelWatch === "mozi" && valorNumerico > 0 && (
                        <InfoMozi>
                            💕 R$ {valorNumerico.toFixed(2).replace(".", ",")}{" "}
                            será contabilizado em Ganhos+ (Mozi)
                        </InfoMozi>
                    )}

                    {responsavelWatch === "dividido" && valorNumerico > 0 && (
                        <InfoMozi>
                            🤝 R${" "}
                            {(valorNumerico / 2)
                                .toFixed(2)
                                .replace(".", ",")}{" "}
                            para cada (50% em Ganhos+ da Mozi)
                        </InfoMozi>
                    )}

                    <label>Tipo</label>
                    <select {...register("tipo", { required: true })}>
                        <option value="Essencial">Essencial</option>
                        <option value="Desejo">Desejo</option>
                        <option value="Poupança">Poupança</option>
                        <option value="Educacao">Educação</option>
                    </select>

                    <label>Categoria</label>
                    <select {...register("categoria", { required: true })}>
                        {CATEGORIAS_PADRAO.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    {categoriaWatch === "OUTRO" && (
                        <CampoPersonalizado>
                            <label>Nome da Categoria Personalizada</label>
                            <input
                                type="text"
                                placeholder="Digite o nome da categoria (ex: Dentista, Jogos, Livros...)"
                                autoFocus
                                {...register("categoriaPersonalizada", {
                                    required: categoriaWatch === "OUTRO",
                                })}
                            />
                        </CampoPersonalizado>
                    )}

                    <label>Cartão</label>
                    <select {...register("cartao", { required: true })}>
                        <option value="Nubank">Nubank</option>
                        <option value="Picpay">Picpay</option>
                        <option value="Banco do Brasil">Banco do Brasil</option>
                    </select>

                    <Footer>
                        <BotaoExcluir
                            type="button"
                            $confirmando={confirmandoExclusao}
                            onClick={handleExcluir}
                        >
                            {confirmandoExclusao
                                ? "Tem certeza? Clique p/ Confirmar"
                                : "Excluir 🗑️"}
                        </BotaoExcluir>

                        <BotoesAcao>
                            <BotaoCancelar type="button" onClick={onClose}>
                                Cancelar
                            </BotaoCancelar>
                            <BotaoSalvar type="submit">
                                Salvar Alterações
                            </BotaoSalvar>
                        </BotoesAcao>
                    </Footer>
                </Form>
            </ModalContent>
        </Overlay>
    );
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
    backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
    background: linear-gradient(145deg, #0d1b2a, #0c3b70);
    padding: 28px;
    border-radius: 18px;
    width: 90%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    border: 2px solid ${({ theme }) => theme.colors.secondary || "#00b3ff"};
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
    box-sizing: border-box;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 12px;

    .titulo {
        color: ${({ theme }) => theme.colors.surface};
        font-size: 1.6rem;
    }
`;

const SubinfoParcela = styled.span`
    display: inline-block;
    font-size: 0.8rem;
    color: #00b3ff;
    background: rgba(0, 179, 255, 0.15);
    padding: 2px 8px;
    border-radius: 6px;
    margin-top: 4px;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 1.8rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin: 0;
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
        color: #ff6b6b;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;

    label {
        color: ${({ theme }) => theme.colors.surface};
        font-weight: 600;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
    }

    input,
    select {
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background-color: ${({ theme }) => theme.colors.background || "#0d1b2a"};
        color: #ffffff;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
            border-color: #00b3ff;
        }
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
    }
`;

const InfoMozi = styled.div`
    font-size: 0.85rem;
    font-weight: 500;
    color: #ff85a2;
    background-color: rgba(255, 107, 129, 0.12);
    border: 1px dashed rgba(255, 107, 129, 0.3);
    padding: 8px 12px;
    border-radius: 8px;
`;

const Footer = styled.div`
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
`;

const BotoesAcao = styled.div`
    display: flex;
    gap: 10px;
`;

const BotaoSalvar = styled.button`
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #820ad1, #00b3ff);
    color: #ffffff;
    font-weight: 600;
    font-size: 0.9rem;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(0, 179, 255, 0.4);
    }
`;

const BotaoCancelar = styled.button`
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    background-color: transparent;
    color: #cccccc;
    font-size: 0.9rem;
    transition: background 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: #ffffff;
    }
`;

const BotaoExcluir = styled.button`
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid ${({ $confirmando }) => ($confirmando ? "#e74c3c" : "rgba(231, 76, 60, 0.4)")};
    cursor: pointer;
    background-color: ${({ $confirmando }) =>
        $confirmando ? "#e74c3c" : "rgba(231, 76, 60, 0.15)"};
    color: ${({ $confirmando }) => ($confirmando ? "#ffffff" : "#ff6b6b")};
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s;

    &:hover {
        background-color: #e74c3c;
        color: #ffffff;
    }
`;

const CampoPersonalizado = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: rgba(0, 0, 0, 0.25);
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px dashed #00b3ff;

    label {
        font-size: 0.85em;
        color: #e0f2fe;
    }

    input {
        background-color: #0b1320;
        color: #ffffff;
        border: 1px solid #00b3ff;
        border-radius: 6px;
        padding: 8px;
        font-size: 0.95em;

        &:focus {
            outline: none;
            box-shadow: 0 0 8px rgba(0, 179, 255, 0.7);
        }
    }
`;

