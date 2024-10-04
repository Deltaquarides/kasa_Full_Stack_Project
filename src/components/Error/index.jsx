import { Link } from "react-router-dom";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const ErrorNumber = styled.p`
  font-size: 23vw;
  margin: 0px;
  font-weight: bold;
  color: #ff7261;
`;
const ErrorText = styled.p`
  text-align: center;
  font-size: clamp(1rem, 7vw, 2rem);
  color: #ff7261;
`;

const ErrorLink = styled(Link)`
  display: flex;
  justify-content: center;
  font-size: clamp(11px, 2vw, 19px);
  color: #ff7261;
  text-decoration: underline 2px;
  pointer: cursor;
`;

export const Error = () => {
  return (
    <>
      <ErrorContainer>
        <ErrorNumber>404</ErrorNumber>
        <ErrorText>Oups! La page que vous demandez n'existe pas.</ErrorText>
        <ErrorLink to="/">Retour sur la page d'accueil</ErrorLink>
      </ErrorContainer>
    </>
  );
};
