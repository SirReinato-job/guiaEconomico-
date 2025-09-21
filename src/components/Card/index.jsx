import styled from "styled-components";

export default function Card({ children, ...props }) {
    return <Container {...props}>{children}</Container>;
}

const Container = styled.div`
    width: ${(props) => (props.$widthSm ? "32%" : "48%")};
    height: ${(props) => (props.$heightSm ? "100px" : "250px")};
    background-color: ${({ theme }) => theme.colors.cardsBg};
    border-radius: 16px;
    padding: ${(props) => (props.$heightSm ? "8px 16px" : "16px")};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: transform 0.2s;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &:hover {
        transform: translateY(-1.5px);
    }
`;
