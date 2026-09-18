import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Titulos } from "../Card";
import { parseCurrency } from "../../utils/currencyUtils";

export default function ModalNovoGasto({ onClose, onSubmit }) {
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            parcelas: "1",
            responsavel: "meu",
        },
    });

    const valorWatch = watch("valor");
    const parcelasWatch = watch("parcelas");
    const responsavelWatch = watch("responsavel");
    const numParcelas = parseInt(parcelasWatch, 10) || 1;
    const valorNumerico = parseCurrency(valorWatch);

    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset();
        onClose();
    };

    return (
        <Overlay>
            <ModalContent>
                <Header>
                    <Titulos className="titulo">Adicionar Novo Gasto</Titulos>
                    <CloseButton onClick={onClose}>X</CloseButton>
                </Header>

                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <label>Data</label>
                    <input
                        type="date"
                        {...register("data", { required: true })}
                    />

                    <label>Valor Total</label>
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
                            será adicionado em Ganhos+ (Mozi)
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

                    <label>Parcelas</label>
                    <select {...register("parcelas")}>
                        <option value="1">1x (À vista)</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                        <option value="5">5x</option>
                        <option value="6">6x</option>
                        <option value="7">7x</option>
                        <option value="8">8x</option>
                        <option value="9">9x</option>
                        <option value="10">10x</option>
                        <option value="11">11x</option>
                        <option value="12">12x</option>
                        <option value="18">18x</option>
                        <option value="24">24x</option>
                    </select>

                    {numParcelas > 1 && valorNumerico > 0 && (
                        <InfoParcelas>
                            {numParcelas}x de R${" "}
                            {(valorNumerico / numParcelas)
                                .toFixed(2)
                                .replace(".", ",")}
                        </InfoParcelas>
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
                        <option value="Poupança">Poupança</option>
                        <option value="Lanches">Lanches</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Educacao">Educação</option>
                        <option value="Alura">Alura</option>
                        <option value="Uber">Uber</option>
                        <option value="Roupas">Roupas</option>
                        <option value="Academia">Academia</option>
                        <option value="Vivo">Vivo</option>
                        <option value="Água">Água</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Caixinha">Caixinha</option>
                        <option value="Alimentação fora">Alimentação fora</option>
                        <option value="Supermercado">Supermercado</option>
                        <option value="Farmácia">Farmácia</option>
                        <option value="Contas">Contas</option>
                        <option value="Outros">Outros</option>
                    </select>
                    <label>Cartão</label>
                    <select {...register("cartao", { required: true })}>
                        <option value="Nubank">Nubank</option>
                        <option value="Picpay">Picpay</option>
                        <option value="Banco do Brasil">Banco do Brasil</option>
                    </select>

                    <Footer>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit">Salvar</button>
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
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: linear-gradient(to right, #0c3b70, #00b3ff);
    padding: 24px;
    border-radius: 16px;
    width: 40%;
    max-width: 60%;
    border: 4px solid ${({ theme }) => theme.colors.secondary};
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    .titulo {
        color: ${({ theme }) => theme.colors.surface};
    }
`;

const CloseButton = styled.button`
    background: ${({ theme }) => theme.colors.surface};
    border: none;
    border-radius: 50%;
    padding: 4px 12px;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 2rem;
    cursor: pointer;
    &:hover {
        background: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.surface};
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;

    label {
        color: ${({ theme }) => theme.colors.surface};
        font-weight: bold;
        letter-spacing: 0.9px;
    }

    input,
    select {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #000;
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.surface};
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
    }
`;

const Footer = styled.div`
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    button {
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        background-color: ${({ theme }) => theme.colors.surface};
        color: ${({ theme }) => theme.colors.secondary};
        &:hover {
            background: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.surface};
        }
        &:first-child {
            background-color: ${({ theme }) => theme.colors.cardsBg};
        }
    }
`;

const InfoParcelas = styled.div`
    color: #e0f2fe;
    font-size: 0.9em;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.25);
    padding: 8px 12px;
    border-radius: 6px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
`;

const InfoMozi = styled.div`
    color: #fdf2f8;
    background: linear-gradient(135deg, rgba(219, 39, 119, 0.3), rgba(147, 51, 234, 0.3));
    font-size: 0.9em;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 6px;
    text-align: center;
    border: 1px solid rgba(244, 114, 182, 0.4);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

