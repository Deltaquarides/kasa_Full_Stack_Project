import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import styled from "styled-components";

const CollapseMain = styled.div`
  width: 100%;
  min-width: 121px;
`;
const CollapseContainer = styled.div`
  color: white;
  background-color: #ff7261;
  display: flex;
  justify-content: space-between;
  height: 35px;
  border-radius: 6px;
  padding: 0px 7px;
  align-items: center;
  position: relative;
`;
const CollapseTitle = styled.h2`
  font-size: clamp(1rem, 3vw, 1.4rem);
`;

const CollapseContent = styled.p`
  background-color: #f1f1f1;
  color: #ff7261;
  border-radius: 7px;
  margin-top: -9px;
  padding: 23px 7px 4px 7px;
`;

const CollapseIconWrapper = styled.div`
  cursor: pointer;
`;
export const Collapse = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDisplay = () => {
    setIsOpen(!isOpen);
  };

  return (
    <CollapseMain>
      <CollapseContainer>
        <CollapseTitle>{title} </CollapseTitle>
        <CollapseIconWrapper onClick={() => toggleDisplay()}>
          {isOpen ? (
            <FontAwesomeIcon icon={faChevronDown} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} transform={{ rotate: 180 }} />
          )}
        </CollapseIconWrapper>
      </CollapseContainer>
      {!isOpen && <CollapseContent>{content}</CollapseContent>}
    </CollapseMain>
  );
};
