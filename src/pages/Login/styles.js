import styled from "styled-components";

export const Container = styled.div`
  padding: 40px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  max-width: 1200px;
`;

export const TopBackground = styled.div`
  height: 30vh;
  width: 90vw;
  max-width: 800px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }

  @media (max-width: 480px) {
    height: 20vh;
    width: 100%;
  }
`;

export const Form = styled.form`
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: #000e5aea;
  padding: 20px;
  border-radius: 0.6rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  color: #ffffff;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
`;

export const ContainerInput = styled.div`
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 0.625rem;
  border: 1px solid #ffffff;
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  color: #ffffff; /* <-- adiciona essa linha para o texto ficar branco */
  background: transparent; /* opcional, se quiser fundo transparente */

  &::placeholder {
    color: #cccccc; /* placeholder em cinza claro */
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

export const Button = styled.button`
  background: linear-gradient(180deg, #ff572dff 0%, #ff6378 100%);
  width: fit-content;
  color: white;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  transition: 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.5;
    transform: scale(0.98);
  }
`;

export const InputLabel = styled.label`
  color: #fff;
  display: flex;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
  justify-content: flex-start;

  span {
    color: #ef4f45;
    font-weight: bold;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 10px;
`;
