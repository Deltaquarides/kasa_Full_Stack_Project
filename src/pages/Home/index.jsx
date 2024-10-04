import homeBanner from "../../assets/images/homeBanner.png";
import { Gallery } from "../../components/Gallery";
import { Banner } from "../../components/Banner";
import styled from "styled-components";

const MainStyl = styled.main`
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 40px;
  @media screen and (max-width: 480px) {
    margin: 20px;
  }
`;

export const Home = () => {
  return (
    <MainStyl>
      <Banner img={homeBanner} title="Chez vous, partout ailleurs" />
      <Gallery />
    </MainStyl>
  );
};
