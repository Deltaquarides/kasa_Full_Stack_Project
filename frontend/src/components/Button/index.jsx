import styled from "styled-components";

const ButtonStyle = styled.button`
  width: 25%;
  margin: auto;
  min-width: 68px;
  border-radius: 5px;
  padding: 4px;
  font-weight: bold;
  background-color: #ffffffc9;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    background-color: #ffffff5c;
    transition: 0.3s ease-in-out;
  }
`;

//Button component have 3 props: title, type and onClick function.
export const Button = ({ title, type, onClick, disabled }) => {
  return (
    <ButtonStyle type={type || "button"} onClick={onClick} disabled={disabled}>
      {title}
    </ButtonStyle>
  );
};
