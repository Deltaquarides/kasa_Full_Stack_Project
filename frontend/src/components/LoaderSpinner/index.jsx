import React from "react";
import styled, { keyframes } from "styled-components";

// Define the spinning animation
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Create a StyledSpinner component
const Spinner = styled.div`
  border: 8px solid #f3f3f3; /* Light gray */
  border-top: 8px solid #3498db; /* Blue color */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 2s linear infinite;
`;

export const LoaderSpinner = () => {
  return <Spinner />;
};
