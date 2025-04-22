import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { LogOut } from "../LogOut";

const ResponsiveIcon = styled(FontAwesomeIcon)`
  position: relative;
  font-size: 4vw;
  color: #2d2727b5;
  cursor: pointer;
  &:hover {
    color: #000000c2;
  }
  @media (max-width: 480px) {
    font-size: 4vw;
  }
`;

const MenuContainer = styled.div`
position: absolute;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    margin-left: -148px;
    width: 170px;
    background-color: #f0f0f0;
    text-align: center;
    margin-top: 4px;
    padding: 5px;
    height:auto;
    z-index:2;
    opacity:0.85;
}
`;

const MenuList = styled.button`
  width: -webkit-fill-available;
  font-size: 26px;
  font-weight: 400;
  text-decoration: none;
  padding: 5px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #80808052;
  }
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

export default MenuList;

export const MenuIcon = () => {
  const [isOpen, setIsopen] = useState(false);

  const { auth } = useAuth();
  const containerRef = useRef(null); // ref to the element we want to detect clicks outside of

  // Function to handle clicks outside the component
  const handleClickOutside = (event) => {
    // Check if the click was outside of the containerRef
    containerRef.current && //checks whether the element exists in the DOM or not.
      //This checks if the element that was clicked (the event.target) is outside of the container.
      //If the clicked target is not inside the container (contains() returns false), then the condition becomes true.
      !containerRef.current.contains(event.target) &&
      setIsopen(false); // Close the dropdown or take any other action
  };

  // Use useEffect to add the event listener for click events on the document
  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts.This avoids memory leaks.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toogleMenu = () => {
    setIsopen(!isOpen);
  };

  return (
    <div ref={containerRef}>
      <ResponsiveIcon icon={faCircleUser} onClick={toogleMenu} />
      {isOpen && (
        <MenuContainer>
          <>
            {" "}
            <Link to="/register">
              <MenuList disabled={auth}>Register</MenuList>
            </Link>
            <Link to="/signin">
              <MenuList disabled={auth}>Signin</MenuList>{" "}
            </Link>
          </>

          <LogOut />
        </MenuContainer>
      )}
    </div>
  );
};
