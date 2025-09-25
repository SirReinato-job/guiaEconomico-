import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Titulos } from "../Card";

export default function ModalNovoGasto({ onClose, onSubmit }) {
    const { register, handleSubmit, reset } = useForm();

    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset();
        onClose();
    };

    return (
        <Overlay >
            <ModalContent>
                <Header>
                    <Titulos>Adicionar Novo Gasto</Titulos>
                    <CloseButton onClick={onClose}>X</CloseButton>
                </Header>

                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <label>Data</label>
                    <input type="date" {...register("data", { required: true })} />

                    <label>Valor</label>
                    <input type="text" placeholder="R$ 0,00" {...register("valor", { required: true })} />

                    <label>Tipo</label>
                    <select {...register("tipo", { required: true })}>
                        <option value="Essencial">Essencial</option>
                        <option value="Desejo">Desejo</option>
                        <option value="Poupança">Poupança</option>
                    </select>

                    <label>Categoria</label>
                    <select {...register("categoria", { required: true })}>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Uber">Uber</option>
                        <option value="Roupas">Roupas</option>
                        <option value="Lanches">Lanches</option>
                        <option value="Água">Água</option>
                        <option value="Manutenção">Manutenção</option>
                    </select>
                    <label>Cartão</label>
                    <select {...register("cartao", { required: true })}>
                        <option value="Nubank">Nubank</option>
                        <option value="Picpay">Picpay</option>
                        <option value="Banco do Brasil">Banco do Brasil</option>
                    </select>

                    <Footer>
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Salvar</button>
                    </Footer>
                </Form>
            </ModalContent>
        </Overlay>
    );
}

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.tercearia};
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
`;

const CloseButton = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: 50%;
  padding: 4px 12px;
  color: ${({ theme }) => theme.colors.surface};
  font-size: 2rem;
  cursor: pointer;
  &:hover { 
    background: ${({ theme }) => theme.colors.surface}; 
    color: ${({ theme }) => theme.colors.secondary}; 
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

  input, select {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #000;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.surface};
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
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
    &:hover { 
    background: ${({ theme }) => theme.colors.surface}; 
    color: ${({ theme }) => theme.colors.secondary}; 
    }
    &:first-child {
      background-color: #777;
    }
  }
`;