import { useState } from "react";
import styled from "styled-components";
import { parseCurrency, formatCurrency } from "../../utils/currencyUtils";

export default function ModalAjusteReserva({ configAtual, onClose, onSave, selicOficial }) {
    const [saldoReal, setSaldoReal] = useState(
        configAtual?.saldoReal !== undefined && configAtual?.saldoReal !== null
            ? String(configAtual.saldoReal).replace(".", ",")
            : ""
    );
    const [rendimentoManual, setRendimentoManual] = useState(
        configAtual?.rendimentoManual !== undefined && configAtual?.rendimentoManual !== null
            ? String(configAtual.rendimentoManual).replace(".", ",")
            : ""
    );
    const [taxaManual, setTaxaManual] = useState(
        configAtual?.taxaManual !== undefined && configAtual?.taxaManual !== null
            ? String(configAtual.taxaManual).replace(".", ",")
            : ""
    );
    const [poupancaFixa, setPoupancaFixa] = useState(
        configAtual?.poupancaFixa !== undefined && configAtual?.poupancaFixa !== null
            ? String(configAtual.poupancaFixa).replace(".", ",")
            : ""
    );

    const [salvando, setSalvando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSalvando(true);

        const payload = {
            saldoReal: saldoReal.trim() !== "" ? parseCurrency(saldoReal) : null,
            rendimentoManual: rendimentoManual.trim() !== "" ? parseCurrency(rendimentoManual) : null,
            taxaManual: taxaManual.trim() !== "" ? parseCurrency(taxaManual) : null,
            poupancaFixa: poupancaFixa.trim() !== "" ? parseCurrency(poupancaFixa) : null,
        };

        await onSave(payload);
        setSalvando(false);
        onClose();
    };

    return (
        <Overlay onClick={onClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <Header>
                    <div>
                        <Titulo>Ajustar Caixinha Nubank</Titulo>
                        <Subtitulo>Calibre o saldo real da sua reserva de emergência e simulação</Subtitulo>
                    </div>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </Header>

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>
                            Saldo Real na Caixinha (R$)
                            <BadgeNubank>Nubank 100% CDI</BadgeNubank>
                        </Label>
                        <Input
                            type="text"
                            placeholder="Ex: 3.638,66"
                            value={saldoReal}
                            onChange={(e) => setSaldoReal(e.target.value)}
                        />
                        <HelperText>
                            Valor exato exibido no aplicativo do Nubank para o mês atual.
                            {saldoReal && (
                                <ValorFormatado> = {formatCurrency(parseCurrency(saldoReal))}</ValorFormatado>
                            )}
                        </HelperText>
                    </FormGroup>

                    <FormGroup>
                        <Label>Rendimento Real Deste Mês (R$)</Label>
                        <Input
                            type="text"
                            placeholder="Ex: 33,50"
                            value={rendimentoManual}
                            onChange={(e) => setRendimentoManual(e.target.value)}
                        />
                        <HelperText>
                            Rendimento auferido na Caixinha no mês vigente.
                        </HelperText>
                    </FormGroup>

                    <FormGroup>
                        <Label>Taxa Selic Anual Personalizada (% a.a.)</Label>
                        <Input
                            type="text"
                            placeholder={selicOficial ? `Atual do BCB: ${selicOficial}% a.a.` : "Ex: 11,15"}
                            value={taxaManual}
                            onChange={(e) => setTaxaManual(e.target.value)}
                        />
                        <HelperText>
                            Deixe em branco para usar a Taxa Selic oficial ({selicOficial || 11.15}% a.a.) obtida do Banco Central.
                        </HelperText>
                    </FormGroup>

                    <FormGroup>
                        <Label>Aporte / Poupança Mensal Futura (R$)</Label>
                        <Input
                            type="text"
                            placeholder="Ex: 1.000,00"
                            value={poupancaFixa}
                            onChange={(e) => setPoupancaFixa(e.target.value)}
                        />
                        <HelperText>
                            Estimativa de aporte mensal usada para projetar seu patrimônio até os 100 anos.
                        </HelperText>
                    </FormGroup>

                    <Actions>
                        <BotaoCancelar type="button" onClick={onClose}>
                            Cancelar
                        </BotaoCancelar>
                        <BotaoSalvar type="submit" disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar e Recalcular"}
                        </BotaoSalvar>
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
    max-width: 520px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(130, 10, 209, 0.15);
    overflow: hidden;
    animation: modalIn 0.25s ease-out;

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
    padding: 22px 24px;
    border-bottom: 1px solid #1e293b;
    background: linear-gradient(135deg, rgba(130, 10, 209, 0.12) 0%, rgba(0, 179, 255, 0.08) 100%);
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
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Label = styled.label`
    font-size: 0.88rem;
    font-weight: 600;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const BadgeNubank = styled.span`
    font-size: 0.7rem;
    font-weight: 700;
    color: #c084fc;
    background: rgba(130, 10, 209, 0.2);
    border: 1px solid rgba(130, 10, 209, 0.4);
    border-radius: 6px;
    padding: 2px 7px;
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
        border-color: #820ad1;
        box-shadow: 0 0 0 3px rgba(130, 10, 209, 0.25);
    }

    &::placeholder {
        color: #475569;
    }
`;

const HelperText = styled.span`
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.3;
`;

const ValorFormatado = styled.span`
    color: #38bdf8;
    font-weight: 600;
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 10px;
    padding-top: 16px;
    border-top: 1px solid #1e293b;
`;

const BotaoCancelar = styled.button`
    background: transparent;
    border: 1px solid #334155;
    color: #94a3b8;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: #1e293b;
        color: #f1f5f9;
    }
`;

const BotaoSalvar = styled.button`
    background: linear-gradient(135deg, #820ad1 0%, #64109c 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
    padding: 10px 22px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(130, 10, 209, 0.3);
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(130, 10, 209, 0.45);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
