import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faTimes,
  faCheck,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Button } from "../Button";
import { useEffect, useRef, useState } from "react";

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

const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  text-align: center;
  color: #ffff;
  text-shadow: 2px 2px black;
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

const nameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,}$/;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//At least 8 characters long, At least one uppercase letter
//At least one lowercase letter, At least one digit,
//At least one special character (e.g., !@#$%^&*)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+-]).{8,}$/;

export const Register = () => {
  const usernameRef = useRef(null);

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const submitHandler = (user, email, pwd) => {
    const form = { name: user, email, pwd };
    console.log(form);
    setIsPending(true);

    fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(" Network response pb!");
        }
        return response.json();
      })
      .then((result) => {
        console.log(`form added:`, JSON.stringify(result, null, 2));
      })
      .catch((err) => {
        console.log(`Error: ${err.message}`);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  useEffect(() => {
    !validName || !validEmail || !validPwd
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [validName, validEmail, validPwd, isDisabled]);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    const result = nameRegex.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = emailRegex.test(email);
    setValidEmail(result);
  }, [email]);
  useEffect(() => {
    const result = passwordRegex.test(pwd);
    setValidPwd(result);
  }, [pwd]);

  //--------------------------------Submit Form---------------------------------//
  const submitFormHandler = (e) => {
    e.preventDefault();
    submitHandler(user, email, pwd); // Call the context method
  };

  return (
    <ContainerSection>
      <Title>Login</Title>

      <FormStyle onSubmit={submitFormHandler}>
        {/* --------------------------------- user ------------------------------------------------- */}
        <div>
          <Label htmlFor="username">
            Username:{" "}
            <FontAwesomeIcon
              icon={faCheck}
              className={validName ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validName || !user ? "hide" : "invalid"}
            />
          </Label>
        </div>
        <Input
          type="text"
          id="username"
          autoComplete="off"
          required
          ref={usernameRef}
          onChange={(e) => {
            setUser(e.target.value);
          }}
          aria-invalid={validName ? "false" : "true"}
          onFocus={() => {
            setUserFocus(true);
          }}
          onBlur={() => {
            setUserFocus(false);
          }}
          aria-describedby="uidnote"
        />

        <p
          id="uidnote"
          className={
            userFocus && user && !validName ? "instructions" : "offscreen"
          }
        >
          {" "}
          <FontAwesomeIcon icon={faInfoCircle} />
          Username Must began with a letter, no space, at least 4 letters and no
          special characters!
        </p>

        {/* ---------------------------------    email ------------------------------------------------- */}
        <Label htmlFor="email">
          Email:{" "}
          <FontAwesomeIcon
            icon={faCheck}
            className={validEmail ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validEmail || !email ? "hide" : "invalid"}
          />
        </Label>
        <Input
          type="email"
          id="email"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          aria-invalid={validEmail ? "false" : "true"}
          onFocus={() => {
            setEmailFocus(true);
          }}
          onBlur={() => {
            setEmailFocus(false);
          }}
          aria-describedby="emailnote"
        />
        <p
          id="emailnote"
          className={
            emailFocus && email && !validEmail ? "instructions" : "offscreen"
          }
        >
          {" "}
          <FontAwesomeIcon icon={faInfoCircle} />
          example of valid email adress: teste@exemplo.us
        </p>

        {/* ---------------------------------    Password ------------------------------------------------- */}
        <Label htmlFor="password">
          Password:{" "}
          <span className={validPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validPwd || !pwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </Label>
        <Input
          type="password"
          id="password"
          required
          onChange={(e) => {
            setPwd(e.target.value);
          }}
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => {
            setPwdFocus(true);
          }}
          onBlur={() => {
            setPwdFocus(false);
          }}
        />
        <p
          id="pwdnote"
          className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
        >
          {" "}
          <FontAwesomeIcon icon={faInfoCircle} />
          At least 8 characters long, one uppercase letter, one lowercase
          letter, one digit, one special character (e.g., !@#$%^&*)
        </p>
        {!isPending && (
          <Button title="log In" type="submit" disabled={isDisabled} />
        )}
        {isPending && (
          <Button title="Adding Form..." type="submit" disabled={isDisabled} />
        )}
        <p>
          already register?
          <Link to="/signin">
            <span style={{ display: "block" }}>Sign In</span>
          </Link>
        </p>
      </FormStyle>
    </ContainerSection>
  );
};
