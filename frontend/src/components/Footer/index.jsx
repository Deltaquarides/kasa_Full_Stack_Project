import logo_footer from "../../assets/logo_footer.png";
import styled from "styled-components";

const FooterWrapper = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  height: 200px;
`;

const FooterLogo = styled.img`
  width: 110px;
  align-self: center;
  padding-top: 56px;
`;

const FooterText = styled.p`
  color: white;
  width: 100%;
  text-align: center;
  padding-top: 10px;
  font-size: 23px;
`;
export const Footer = () => {
  return (
    <FooterWrapper>
      <FooterLogo src={logo_footer} alt="logo_du_footer" />
      <FooterText>© 2020 Kasa. All rights reserved</FooterText>
    </FooterWrapper>
  );
};
