import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import ModalNovoGasto from "../../components/ModalNovoGasto";
import ModalReceita from "../../components/ModalReceita";
import ModalEssencial from "../../components/ModalGastoEssencial";
import { useShowModals } from "../../hooks/useShowModals";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";

export default function ContainerGeral() {
    const {
        showModalGasto,
        setShowModalGasto,
        showModalSaldo,
        setShowModalSaldo,
        showModalEssencial,
        setShowModalEssencial,
        adicionarGasto,
        adicionarReceita,
        adicionarEssencial,
    } = useShowModals();

    const { user, logout } = useAuth();

    return (
        <>
            <Container>
                <NavContainer>
                    <NavCardContainer>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Logo size={72} showText={true} />
                        </Link>
                        <StyledButton onClick={() => setShowModalSaldo(true)}>
                            ➕ Receita
                        </StyledButton>
                        <StyledButton onClick={() => setShowModalGasto(true)}>
                            📉 Novo Gasto
                        </StyledButton>
                        <StyledLink to="/gastos-cartao">
                            📁 Gastos por Cartão
                        </StyledLink>
                        <StyledButton
                            onClick={() => setShowModalEssencial(true)}
                        >
                            📉 Gastos Essenciais
                        </StyledButton>
                        <StyledLink to="/comparativo">
                            🧮 Comparativo
                        </StyledLink>
                        <StyledLink to="/insights">
                            🧠 Insights Financeiros
                        </StyledLink>
                        <StyledLink to="/configuracoes">
                            ⚙️ Configurações
                        </StyledLink>

                        {user && (
                            <UserCard>
                                {user.photoURL ? (
                                    <UserAvatar
                                        src={user.photoURL}
                                        alt={user.displayName || "Usuário"}
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <UserAvatarPlaceholder>
                                        {(user.displayName || user.email || "U")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </UserAvatarPlaceholder>
                                )}
                                <UserInfo>
                                    <UserName>
                                        {user.displayName || "Usuário"}
                                    </UserName>
                                    <UserEmail>{user.email}</UserEmail>
                                </UserInfo>
                                <BotaoSair onClick={logout}>
                                    Sair 🚪
                                </BotaoSair>
                            </UserCard>
                        )}
                    </NavCardContainer>
                </NavContainer>

                <MainContainer>
                    <Outlet />
                </MainContainer>

                <Footer>
                    <p className="textFooter">Desenvolvido by SirReinato</p>
                </Footer>
            </Container>
            {showModalGasto && (
                <ModalNovoGasto
                    onClose={() => setShowModalGasto(false)}
                    onSubmit={adicionarGasto}
                />
            )}
            {showModalSaldo && (
                <ModalReceita
                    onClose={() => setShowModalSaldo(false)}
                    onSubmit={adicionarReceita}
                />
            )}
            {showModalEssencial && (
                <ModalEssencial
                    onClose={() => setShowModalEssencial(false)}
                    onSubmit={adicionarEssencial}
                />
            )}
        </>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 15% 85%;
    grid-template-rows: 1fr auto;
    grid-template-areas:
        "nav main"
        "footer footer";
    height: 100vh;
    box-sizing: border-box;
`;

const NavContainer = styled.div`
    display: flex;
    grid-area: nav;
    box-sizing: border-box;
    color: white;
    padding: 60px 8px;
`;

const NavCardContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 16px 8px;
    background-color: ${({ theme }) => theme.colors.cardsBg};
    border-radius: 16px;
`;

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    background-color: ${(props) => (props.$bgBtn ? "#777777" : "transparent")};
    padding: ${(props) => (props.$bgBtn ? "12px 16px" : "4px 12px")};
    border-radius: 8px;
    transition: background-color 0.3s ease;
    width: 100%;
    text-align: center;
    box-sizing: border-box;

    &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.textOnPrimary};
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const StyledButton = styled.button`
    background: transparent;
    border: none;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 8px;
    width: 100%;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.textOnPrimary};
    }

    &:active {
        transform: scale(0.98);
    }
`;

const UserCard = styled.div`
    width: 100%;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const UserAvatar = styled.img`
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.secondary || "#00b3ff"};
`;

const UserAvatarPlaceholder = styled.div`
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #820ad1, #00b3ff);
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
`;

const UserInfo = styled.div`
    text-align: center;
    width: 100%;
    overflow: hidden;
`;

const UserName = styled.p`
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const UserEmail = styled.p`
    font-size: 0.7rem;
    color: #888888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const BotaoSair = styled.button`
    background-color: rgba(231, 76, 60, 0.15);
    border: 1px solid rgba(231, 76, 60, 0.4);
    color: #ff6b6b;
    font-size: 0.8rem;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    width: 90%;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(231, 76, 60, 0.3);
        transform: translateY(-1px);
    }
`;

const MainContainer = styled.div`
    grid-area: main;
    overflow-y: auto;
    padding: 1rem;
`;

const Footer = styled.div`
    grid-area: footer;
    background-color: ${({ theme }) => theme.colors.cardsBg};
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    .textFooter {
        padding-top: 5px;
        text-align: center;
        background: linear-gradient(to right, #820ad1, #00b3ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
    }
`;
