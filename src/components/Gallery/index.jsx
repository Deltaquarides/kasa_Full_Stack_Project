import styled from "styled-components";
import listApartment from "../../utils/listApartment.json";
import { Link } from "react-router-dom";

const GallerySection = styled.section`
  background-color: rgb(247 247 247);
  padding-top: 1rem;
  padding-bottom: 3rem;
  border-radius: 25px;

  @media screen and (min-width: 480px) {
    ::after {
      content: "";
      flex-basis: 30%;
    }
  }

  @media screen and (max-width: 480px) {
    background-color: white;
  }
`;

const GalleryContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const GalleryArticle = styled.article`
  width: 100%;
  height: 100%;
  position: relative;
  @media screen and (max-width: 480px) {
    height: 169px;
    width: 100%;
    max-width: 398px;
    object-position: center;
  }
`;
const GalleryImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 25px;
`;

const ArticleTitle = styled.span`
  position: absolute;
  bottom: 21%;
  left: 3%;
  color: white;
  font-size: clamp(0.8rem, 2vw, 1.3rem);
  width: 70%;
  height: 30px;
  padding-top: 0px;
    text-shadow: 4px 3px 3px #170a06;

  @media screen and (max-width: 480px) {
    bottom: 10%;
    width: 60%;
  }
`;
const LinkStyle = styled(Link)`
  @media screen and (max-width: 1024px) {
    width: 40%;
  }

  @media screen and (min-width: 1024px) {
    width: 30%;
    min-height: 150px;
  }

  @media screen and (max-width: 480px) {
    display: flex;
    width: 100%;
  }
`;
export const Gallery = () => {
  return (
    <GallerySection>
      <GalleryContainer>
        {listApartment.map((apartment, index) => {
          const { id, cover, title } = apartment;
          return (
            <>
              <LinkStyle to={`/logement/${id}`}>
                <GalleryArticle key={`${id}-${index}`}>
                  <GalleryImg src={cover} alt="apartment_cover" />
                  <ArticleTitle>{title}</ArticleTitle>
                </GalleryArticle>
              </LinkStyle>
            </>
          );
        })}
      </GalleryContainer>
    </GallerySection>
  );
};
