import { useAuth } from "../../context/AuthProvider";

import { useNavigate } from "react-router-dom";
import MenuList from "../MenuIcon"; // import a Styled Component:MenuList, from MenuIcon

export const LogOut = () => {
  const { logout } = useAuth();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <MenuList disabled={!auth} onClick={handleLogout}>
      Logout
    </MenuList>
  );
};
