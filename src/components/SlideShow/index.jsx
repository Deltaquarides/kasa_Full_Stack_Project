import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import styled from "styled-components";

const SlideShowContainer = styled.div`
  width: 100%;
  height: auto;
  max-height: 350px;
  object-fit: cover;
  ${(props) => props.$relativity && `position: relative;`}
`;
const SlideShowImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-height: 350px;
  border-radius: 25px;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 8vw;
  position: absolute;
  z-index: 1;
  color: white;
  top: 37%;

  ${(props) => props.$leftty && `left: 0;`}
  ${(props) => props.$righty && `right: 0;`}
`;

const BulletPoint = styled.span`
  position: absolute;
  color: white;
  font-size: clamp(0.5rem, 7vw, 3rem);
  width: 100%;
  bottom: 10px;
  right: 0;
  text-align: center;
  visibility: visible;
  @media screen and (width <= 320px) {
    visibility: hidden;
  }
`;

export const SlideShow = ({ specificApartment, id }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const length = specificApartment.pictures.length;

  //L'orsque l'on arrive à la derniere image, retour à la premère image et inversement.
  const nextImage = () => {
    setCurrentImg(currentImg === length - 1 ? 0 : currentImg + 1);
  };

  const prevImage = () => {
    setCurrentImg(currentImg === 0 ? length - 1 : currentImg - 1);
  };

  // Si notre corrousel ne contient qu'une image --> pas de flèches ni de bullet point.
  if (length === 1) {
    return (
      <SlideShowContainer>
        <SlideShowImg
          src={specificApartment.pictures[currentImg]}
          alt="pics of apartment"
        />
      </SlideShowContainer>
    );
  } else {
    return (
      <>
        <SlideShowContainer $relativity>
          <SlideShowImg
            src={specificApartment.pictures[currentImg]}
            alt="pics of apartment"
          />
          <StyledFontAwesomeIcon
            $leftty
            icon={faChevronDown}
            transform={{ rotate: 90 }}
            onClick={prevImage}
          />
          <StyledFontAwesomeIcon
            $righty
            icon={faChevronDown}
            transform={{ rotate: -85 }}
            style={{}}
            onClick={nextImage}
          />
          <BulletPoint>
            {currentImg + 1}/{length}
          </BulletPoint>
        </SlideShowContainer>
      </>
    );
  }
};
