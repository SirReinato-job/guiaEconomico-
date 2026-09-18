import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";

export default function Login() {
    const { loginComGoogle, authError } = useAuth();

    return (
        <LoginContainer>
            <LoginCard>
                <Logo size={85} showText={false} />
                <Titulo>Guia Econômico</Titulo>
                <Subtitulo>Controle Financeiro Pessoal & Previsibilidade</Subtitulo>

                <MensagemAviso>
                    Acesso restrito ao proprietário do painel. Faça login com sua conta do Google para continuar.
                </MensagemAviso>

                {authError && <ErroContainer>{authError}</ErroContainer>}

                <BotaoGoogle onClick={loginComGoogle}>
                    <FcGoogle size={24} />
                    <span>Entrar com Google</span>
                </BotaoGoogle>

                <FooterTexto>Desenvolvido por SirReinato</FooterTexto>
            </LoginCard>
        </LoginContainer>
    );
}

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    background-color: ${({ theme }) => theme.colors.backgroundHome || "#0b0b1c"};
    padding: 16px;
    box-sizing: border-box;
`;

const LoginCard = styled.div`
    background-color: ${({ theme }) => theme.colors.cardsBg || "#060f1a"};
    border: 1px solid rgba(130, 10, 209, 0.3);
    border-radius: 20px;
    padding: 48px 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 440px;
    width: 100%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    text-align: center;
`;

const Titulo = styled.h1`
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 8px;
    background: linear-gradient(to right, #820ad1, #00b3ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
`;

const Subtitulo = styled.p`
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textSecondary || "#888888"};
    margin-bottom: 24px;
`;

const MensagemAviso = styled.p`
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textPrimary || "#e0e1dd"};
    background-color: rgba(0, 179, 255, 0.08);
    border: 1px solid rgba(0, 179, 255, 0.2);
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 24px;
    line-height: 1.4;
`;

const ErroContainer = styled.div`
    background-color: rgba(231, 76, 60, 0.15);
    border: 1px solid #e74c3c;
    color: #ff6b6b;
    font-size: 0.85rem;
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 20px;
    width: 100%;
    box-sizing: border-box;
    text-align: left;
`;

const BotaoGoogle = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 14px 20px;
    background-color: #ffffff;
    color: #333333;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0, 179, 255, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
`;

const FooterTexto = styled.span`
    margin-top: 32px;
    font-size: 0.8rem;
    color: #555555;
`;
