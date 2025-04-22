import deniedStamp from "../../assets/images/deniedStamp.png";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand } from "@fortawesome/free-solid-svg-icons";

const ContainerImg = styled.div`
  display: flex;
  justify-content: center;
`;

const ContainerFaHand = styled.div`
  display: flex;
  justify-content: center;
`;

const FaHandStyle = styled(FontAwesomeIcon)`
  font-size: 15vw;
  color: #ff0000c7;
`;

const DeniedImg = styled.img`
  width: 500px;
  height: 500px;

  transform: rotate(-20deg);
`;

const TitleStyle = styled.h1`
  color: #ff0000c7;
  text-align: center;
`;

export const Unauthorized = () => {
  return (
    <>
      <TitleStyle>Unauthoraized Acces</TitleStyle>
      <ContainerFaHand>
        <FaHandStyle icon={faHand} />
      </ContainerFaHand>
      <ContainerImg>
        <DeniedImg src={deniedStamp} alt="acces denied" />
      </ContainerImg>
    </>
  );
};
