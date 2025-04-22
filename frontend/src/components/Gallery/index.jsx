import styled from "styled-components";
import { Link } from "react-router-dom";

const GallerySection = styled.section`
  background-color: rgb(247 247 247);
  padding-top: 1rem;
  padding-bottom: 3rem;
  border-radius: 25px;

  @media screen and (min-width: 577px) {
    ::after {
      content: "";
      flex-basis: 30%;
    }
  }

  @media screen and (max-width: 576px) {
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
  @media screen and (max-width: 576px) {
    height: 169px;
    width: 100%;
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

  @media screen and (max-width: 576px) {
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

  @media screen and (max-width: 576px) {
    display: flex;
    width: 100%;
  }
`;

// "http://localhost:8080/api/home"
export const Gallery = ({
  error, // Pass the error  as props
  items, // Pass the fetched items as props
  titleField, // field name for for the title (ex.: title)
  coverField, // Field name for the image URL (ex.: cover )
  linkPath, // the path for the link where ":id" is the dynamic part of the URL
}) => {
  return (
    <>
      {error && <div>{error}</div>}
      {items && (
        <GallerySection>
          <GalleryContainer>
            {items?.map((item, index) => {
              const itemId = item.id;
              const cover = item[coverField];
              const title = item[titleField];
              return (
                <LinkStyle
                  key={`${itemId}-${index}`}
                  to={linkPath.replace(":id", itemId)}
                >
                  {" "}
                  {/* `/logement/itemId` */}
                  <GalleryArticle>
                    <GalleryImg src={cover} alt={`${title}_cover`} />
                    <ArticleTitle>{title}</ArticleTitle>
                  </GalleryArticle>
                </LinkStyle>
              );
            })}
          </GalleryContainer>
        </GallerySection>
      )}
    </>
  );
};
