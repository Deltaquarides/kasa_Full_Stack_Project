import styled from "styled-components";
import { Button } from "../Button";
import { useRef, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const ContainerSection = styled.section`
  display: flex;
  justify-content: center;
  background-color: gray;
  padding: 1rem;
  border: 1px solid black;
  margin: 3rem auto;
  width: 20%;
  min-width: 180px;
  border-radius: 5px;
  box-shadow: 6px 5px 8px -2px;
  flex-direction: column;
`;
const Title = styled.h1`
  text-align: center;
  color: #ffff;
  text-shadow: 2px 2px black;
`;

const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Label = styled.label`
  font-weight: bold;
  color: white;
`;

const Input = styled.input`
  font-weight: bold;
  padding: 0.3rem;
  border-radius: 9px;
  background-color: #ffffffdb;
  margin-bottom: 0.5rem;
`;
export const Signin = () => {
  const userRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const { setAuth } = useAuth(); // Access context

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // we want to know where the user came from

  const submitHandler = (e) => {
    e.preventDefault();

    const form = { name: user, pwd };

    const jwtToken = localStorage.getItem("jwtToken"); // Retreive the token from localStorage before making the fetch request

    fetch("http://localhost:8080/api/auth/signin", {
      method: "POST",
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "", // Only include the token if it exists an asign it to Bearer
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(form),
      //credentials: "include", // This tells the browser to include cookies with the request
    })
      .then((response) => {
        if (!response.ok) {
          console.log("No response", form);
        }
        return response.json();
      })
      .then((result) => {
        console.log(`form added: `, JSON.stringify(result));

        const accesToken = result.token;
        //  const id = result.userId;
        const role = result.role;
        console.log(
          `TOKEN :,${result.token}, id:${result.userId}, role: ${result.role} `
        );

        // Store the token in localStorage for future requests
        localStorage.setItem("jwtToken", accesToken);
        localStorage.setItem("role", role);

        // retreive the token and save in setAuth state
        setAuth({ user, pwd, accesToken, role });
        console.log("Auth state updated:", { user, pwd, accesToken, role }); // Log the updated state in Signin

        setUser("");
        setPwd("");
        navigate(from, { replace: true }); // to go where the user were headed
      })
      .catch((err) => {
        console.log(`Error: ${err.message}`);
      });
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  return (
    <ContainerSection>
      <Title>Sign In</Title>
      <FormStyle onSubmit={submitHandler}>
        <Label htmlFor="username">Username</Label>
        <Input
          ref={userRef}
          type="text"
          id="username"
          autoComplete="off"
          required
          onChange={(e) => {
            setUser(e.target.value);
          }}
          value={user}
        ></Input>

        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          autoComplete="off"
          required
          onChange={(e) => {
            setPwd(e.target.value);
          }}
          value={pwd}
        ></Input>

        <Button title="SignIn" type="submit" />
      </FormStyle>
      <p>
        Need an Account?
        <Link to="/register">
          <span style={{ display: "block" }}>Log In</span>
        </Link>
      </p>
    </ContainerSection>
  );
};
