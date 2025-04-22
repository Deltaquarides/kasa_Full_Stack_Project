import styled from "styled-components";

const BannerContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  height: ${(props) => props.height || "100px"};
  width: 100%;
  @media screen and (max-width: 480px) {
    height: 100px;
    margin-bottom: 1rem;
  }
`;

const BannerImg = styled.img`
  width: 100%;
  border-radius: 25px;
  height: 100%;
  object-fit: cover;
  filter: brightness(65%);
`;
const BannerText = styled.h1`
  position: absolute;
  top: 28%;
  left: 52%;
  font-weight: 500;
  font-size: clamp(1rem, 5vw, 4.375rem);
  width: 88%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  @media screen and (max-width: 480px) {
    width: auto;
    left: 46%;
    transform: translate(-68%, -31%);
    text-align: left;
  }
`;
export const Banner = ({ img, title, height }) => {
  return (
    <>
      <BannerContainer height={height}>
        <BannerImg src={img} alt="landscape" />
        <BannerText>{title}</BannerText>
      </BannerContainer>
    </>
  );
};
