import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";

export default function AcessoRestritoInsights() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <ContainerRestrito>
            <CardAviso>
                <IconeWrapper>
                    <IconeEscudo>🛡️</IconeEscudo>
                    <IconeCadeado>🔒</IconeCadeado>
                </IconeWrapper>

                <TagStatus>Acesso Restrito ao Proprietário</TagStatus>

                <Titulo>Área Confidencial de Insights</Titulo>

                <Descricao>
                    Os <strong>Insights Financeiros</strong> contêm a análise histórica da{" "}
                    <strong>Reserva de Emergência pessoal</strong>, histórico da Caixinha Nubank e
                    as projeções de longo prazo do proprietário do dashboard.
                </Descricao>

                {user && (
                    <CardUsuarioConectado>
                        {user.photoURL ? (
                            <Avatar
                                src={user.photoURL}
                                alt={user.displayName || "Usuário"}
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <AvatarPlaceholder>
                                {(user.displayName || user.email || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                            </AvatarPlaceholder>
                        )}
                        <InfoUsuario>
                            <NomeUsuario>{user.displayName || "Usuário Conectado"}</NomeUsuario>
                            <EmailUsuario>{user.email}</EmailUsuario>
                            <StatusNegado>
                                ⛔ Conta não autorizada para visualizar esta reserva
                            </StatusNegado>
                        </InfoUsuario>
                    </CardUsuarioConectado>
                )}

                <AvisoSeguranca>
                    💡 Para visualizar estes dados, faça login com a conta oficial do proprietário (
                    <code>[EMAIL_ADDRESS]</code>) O restante do painel (Gastos, Cartões e Saldos) permanece disponível normalmente.
                </AvisoSeguranca>

                <BotoesAcao>
                    <BotaoPrimario onClick={() => navigate("/")}>
                        🏠 Voltar ao Painel Principal
                    </BotaoPrimario>
                    <BotaoSecundario onClick={() => navigate("/gastos-cartao")}>
                        💳 Gastos por Cartão
                    </BotaoSecundario>
                    <BotaoSair onClick={logout}>
                        🚪 Trocar de Conta Google
                    </BotaoSair>
                </BotoesAcao>
            </CardAviso>
        </ContainerRestrito>
    );
}

const pulseGlow = keyframes`
    0% {
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.2), inset 0 0 10px rgba(130, 10, 209, 0.15);
    }
    50% {
        box-shadow: 0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(130, 10, 209, 0.3);
    }
    100% {
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.2), inset 0 0 10px rgba(130, 10, 209, 0.15);
    }
`;

const ContainerRestrito = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    padding: 24px 16px;
`;

const CardAviso = styled.div`
    background: linear-gradient(145deg, #0d121f 0%, #16192b 100%);
    border: 1px solid rgba(239, 68, 68, 0.35);
    border-radius: 20px;
    padding: 36px 28px;
    max-width: 580px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    animation: ${pulseGlow} 3s infinite ease-in-out;
    box-sizing: border-box;

    @media (max-width: 480px) {
        padding: 24px 16px;
    }
`;

const IconeWrapper = styled.div`
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
`;

const IconeEscudo = styled.span`
    font-size: 3.5rem;
    filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.5));
`;

const IconeCadeado = styled.span`
    position: absolute;
    bottom: -4px;
    right: -8px;
    font-size: 1.8rem;
    filter: drop-shadow(0 0 8px rgba(0, 179, 255, 0.6));
`;

const TagStatus = styled.span`
    display: inline-block;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: #f87171;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 12px;
    border-radius: 20px;
`;

const Titulo = styled.h2`
    font-size: 1.6rem;
    font-weight: 800;
    color: #f8fafc;
    margin: 0;
    line-height: 1.25;

    @media (max-width: 480px) {
        font-size: 1.35rem;
    }
`;

const Descricao = styled.p`
    font-size: 0.95rem;
    color: #94a3b8;
    line-height: 1.55;
    margin: 0;

    strong {
        color: #e2e8f0;
    }
`;

const CardUsuarioConectado = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(15, 23, 42, 0.75);
    border: 1px solid #1e293b;
    border-radius: 12px;
    padding: 12px 18px;
    width: 100%;
    text-align: left;
    box-sizing: border-box;

    @media (max-width: 480px) {
        flex-direction: column;
        text-align: center;
        padding: 12px;
    }
`;

const Avatar = styled.img`
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 2px solid #ef4444;
    object-fit: cover;
    flex-shrink: 0;
`;

const AvatarPlaceholder = styled.div`
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: #334155;
    color: #f8fafc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    font-weight: bold;
    border: 2px solid #ef4444;
    flex-shrink: 0;
`;

const InfoUsuario = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    overflow: hidden;
    flex: 1;
`;

const NomeUsuario = styled.span`
    font-size: 0.92rem;
    font-weight: 700;
    color: #f1f5f9;
`;

const EmailUsuario = styled.span`
    font-size: 0.8rem;
    color: #94a3b8;
    word-break: break-all;
`;

const StatusNegado = styled.span`
    font-size: 0.75rem;
    font-weight: 600;
    color: #ef4444;
    margin-top: 2px;
`;

const AvisoSeguranca = styled.div`
    font-size: 0.85rem;
    color: #cbd5e1;
    background: rgba(30, 41, 59, 0.6);
    border-left: 3px solid #00b3ff;
    padding: 10px 14px;
    border-radius: 6px;
    text-align: left;
    line-height: 1.5;
    width: 100%;
    box-sizing: border-box;

    code {
        background: #0f172a;
        color: #38bdf8;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.82rem;
    }
`;

const BotoesAcao = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: 8px;
`;

const BotaoPrimario = styled.button`
    background: linear-gradient(135deg, #820ad1 0%, #00b3ff 100%);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 14px rgba(130, 10, 209, 0.4);
    }
`;

const BotaoSecundario = styled.button`
    background: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #334155;
        color: #ffffff;
    }
`;

const BotaoSair = styled.button`
    background: transparent;
    color: #94a3b8;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
        border-color: rgba(239, 68, 68, 0.6);
    }
`;
