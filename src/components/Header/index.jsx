import { NavLink } from "react-router-dom";
import LOGO from "../../assets/images/logo/LOGO.svg";
import styled from "styled-components";

const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin:40px;
    gap: 2rem;
    width:auto;
    @media screen and (max-width: 480px) {
      margin:20px;     
      gap: 1rem;

    }
}
`;

const KasaLogo = styled.img`
  width: 17vw;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4rem;
  @media screen and (max-width: 480px) {
    gap: 1rem;
  }
`;

const StyledLink = styled(NavLink)`
  font-size: 30px;
  font-weight: 400;
  color:rgb(255, 114, 97);
  @media screen and (max-width: 480px) {
    font-size: 5vw;

  }
  &:hover {
   opacity:0.8;
   transform: scale(1.1);
   transition:  0.3s ease-in-out;
  }
}
`;
const navLinkStyles = ({ isActive }) => {
  return {
    textDecoration: isActive ? "underline 2px" : "none",
  };
};

export const Header = () => {
  return (
    <NavContainer>
      <KasaLogo src={LOGO} alt="insta" className="img-logo" />
      <Nav>
        <StyledLink to="/" style={navLinkStyles}>
          Accueil
        </StyledLink>
        <StyledLink to="/about" style={navLinkStyles}>
          A Propos
        </StyledLink>
      </Nav>
    </NavContainer>
  );
};
