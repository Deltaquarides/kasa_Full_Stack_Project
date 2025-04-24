/*
collection9@exemplo.us
collection9
collection9POI+

*/
import { useMemo, useState } from "react";
import { useFetch } from "../../utils/hook";
import { HostAptForm } from "../../components/HostAptForm";
import { LoaderSpinner } from "../../components/LoaderSpinner";

export const HostCreateApt = () => {
  const jwtToken = localStorage.getItem("jwtToken"); // Retreive the token from localStorage before making the fetch request
  // used to trigger fetch
  // Have all of the form data inside due to
  //  handleUpdate who is the form submission handler.
  const [formData, setFormData] = useState(null);

  //hook useMemo to store: method, headers, and body, useMemo ensure reference is stable across renders.
  const options = useMemo(() => {
    if (!formData) return null;
    return {
      method: "POST",
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "", // Replace with the actual token or credentials
      },
      body: formData,
    };
  }, [formData, jwtToken]);

  //child is the hook usefetch need to send the url and options.
  const { data, error, isLoading } = useFetch(
    formData ? "http://localhost:8080/api/host-only" : null,
    options
  );

  /*
  handleCreate function is the form submission handler.
  It takes dataToSend (the form data "formData", created inside the HostAptForm).
  setFormData(dataToSend) stores this form data into the state.
  Since the options object in the useMemo hook depends on formData, setting formData 
  triggers a re-calculation of options and the fetch request is made via useFetch with the updated options.
  The role of handleCreate is to prepare and set the form data in state, which will trigger the fetch request 
  due to the useMemo dependency on formData. This separation allows to control when the fetch request 
  should occur, only after submitting the form data.
  */
  const handleCreate = (dataToSend) => {
    setFormData(dataToSend); // triggers the fetch via useMemo + useFetch
  };

  return (
    <main
      style={{
        height: "80%",
        backgroundColor: "grey",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HostAptForm
        onSubmit={handleCreate}
        submitButtonText="Create"
        titleForm="Mettez à louer votre logement"
      />

      {/*  feedback from fetch */}
      {isLoading && <LoaderSpinner />}
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
      {data && <p>Réponse du serveur : {JSON.stringify(data)}</p>}
    </main>
  );
};

/*Prop-Driven State Syncing: The selectedOptions state inside the child component 
is initialized with the selectedValues prop passed by the parent. This means that when the component first loads, 
 the child knows what the initial selected values are,
 based on what the parent has passed. This is why you have: */
