import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { parseCurrency, formatCurrency } from "../../utils/currencyUtils";

export default function ModalEditarReceita({ receita, onClose, onUpdate, onDelete }) {
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [salvando, setSalvando] = useState(false);

    // Formata o valor inicial para exibição amigável
    const valorInicial = receita?.valor !== undefined
        ? String(receita.valor).includes(",")
            ? String(receita.valor)
            : Number(receita.valor).toFixed(2).replace(".", ",")
        : "";

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            data: receita?.data || "",
            valor: valorInicial,
            descricao: receita?.descricao || receita?.nome || "",
            tipo: receita?.tipo || "Salario",
        },
    });

    const valorWatch = watch("valor");
    const valorNumerico = parseCurrency(valorWatch);

    const handleFormSubmit = async (formData) => {
        setSalvando(true);
        const dadosAtualizados = {
            ...receita,
            ...formData,
            valor: parseCurrency(formData.valor),
        };
        await onUpdate(receita.id, dadosAtualizados);
        setSalvando(false);
        onClose();
    };

    const handleExcluir = async () => {
        if (!confirmandoExclusao) {
            setConfirmandoExclusao(true);
            return;
        }
        setSalvando(true);
        await onDelete(receita.id);
        setSalvando(false);
        onClose();
    };

    return (
        <Overlay onClick={onClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <Header>
                    <div>
                        <Titulo>Editar Receita / Saldo</Titulo>
                        <Subtitulo>Atualize as informações ou remova o lançamento</Subtitulo>
                    </div>
                    <CloseButton type="button" onClick={onClose}>
                        &times;
                    </CloseButton>
                </Header>

                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormGroup>
                        <Label>Data</Label>
                        <Input
                            type="date"
                            {...register("data", { required: true })}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Descrição / Origem</Label>
                        <Input
                            type="text"
                            placeholder="Ex: Salário da Empresa, Freela, Venda..."
                            {...register("descricao")}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Valor (R$)</Label>
                        <Input
                            type="text"
                            placeholder="Ex: 3.500,00"
                            {...register("valor", { required: true })}
                        />
                        {valorWatch && (
                            <HelperValor>
                                Valor reconhecido: <strong>{formatCurrency(valorNumerico)}</strong>
                            </HelperValor>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label>Tipo / Categoria</Label>
                        <Select {...register("tipo", { required: true })}>
                            <option value="Salario">💼 Salário</option>
                            <option value="Outro">📈 Ganho / Extra</option>
                            <option value="gastoNeguinha">💕 PgNeguinha</option>
                            <option value="Investimento">💰 Investimento</option>
                        </Select>
                    </FormGroup>

                    <Actions>
                        <BotaoExcluir
                            type="button"
                            onClick={handleExcluir}
                            disabled={salvando}
                            $confirmando={confirmandoExclusao}
                        >
                            {confirmandoExclusao ? "Confirmar Exclusão?" : "Excluir 🗑️"}
                        </BotaoExcluir>

                        <BotoesSalvarGroup>
                            <BotaoCancelar type="button" onClick={onClose} disabled={salvando}>
                                Cancelar
                            </BotaoCancelar>
                            <BotaoSalvar type="submit" disabled={salvando}>
                                {salvando ? "Salvando..." : "Salvar Alterações"}
                            </BotaoSalvar>
                        </BotoesSalvarGroup>
                    </Actions>
                </Form>
            </ModalCard>
        </Overlay>
    );
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(4, 8, 16, 0.85);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
`;

const ModalCard = styled.div`
    background: #0d121f;
    border: 1px solid #1e293b;
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.15);
    overflow: hidden;
    animation: modalIn 0.22s ease-out;

    @keyframes modalIn {
        from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 24px;
    border-bottom: 1px solid #1e293b;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(0, 179, 255, 0.08) 100%);
`;

const Titulo = styled.h2`
    font-size: 1.25rem;
    font-weight: 700;
    color: #f8fafc;
    margin: 0 0 4px 0;
`;

const Subtitulo = styled.p`
    font-size: 0.82rem;
    color: #94a3b8;
    margin: 0;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 1.6rem;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    transition: color 0.15s ease;

    &:hover {
        color: #f1f5f9;
    }
`;

const Form = styled.form`
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Label = styled.label`
    font-size: 0.86rem;
    font-weight: 600;
    color: #cbd5e1;
`;

const Input = styled.input`
    background: #131b2e;
    border: 1px solid #23314d;
    color: #f8fafc;
    font-size: 0.95rem;
    padding: 10px 14px;
    border-radius: 8px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
    }

    &::placeholder {
        color: #475569;
    }
`;

const Select = styled.select`
    background: #131b2e;
    border: 1px solid #23314d;
    color: #f8fafc;
    font-size: 0.95rem;
    padding: 10px 14px;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
    }
`;

const HelperValor = styled.span`
    font-size: 0.75rem;
    color: #34d399;

    strong {
        color: #10b981;
    }
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    padding-top: 16px;
    border-top: 1px solid #1e293b;
`;

const BotoesSalvarGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const BotaoExcluir = styled.button`
    background: ${({ $confirmando }) =>
        $confirmando ? "#ef4444" : "rgba(239, 68, 68, 0.15)"};
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: ${({ $confirmando }) => ($confirmando ? "#ffffff" : "#f87171")};
    padding: 9px 14px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
        background: #ef4444;
        color: #ffffff;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const BotaoCancelar = styled.button`
    background: transparent;
    border: 1px solid #334155;
    color: #94a3b8;
    padding: 9px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: #1e293b;
        color: #f1f5f9;
    }
`;

const BotaoSalvar = styled.button`
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.45);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
