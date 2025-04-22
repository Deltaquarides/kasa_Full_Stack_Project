/*
collection9@exemplo.us
collection9
collection9POI+

*/
import { useMemo, useState } from "react";
import { useFetch } from "../../utils/hook";
import { HostAptForm } from "../../components/HostAptForm";

export const HostCreateApt = () => {
  const jwtToken = localStorage.getItem("jwtToken"); // Retreive the token from localStorage before making the fetch request
  const [formData, setFormData] = useState(null); // used to trigger fetch

  //hook useMemo
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
      {isLoading && <p>Envoi en cours...</p>}
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
      {data && <p>Réponse du serveur : {JSON.stringify(data)}</p>}
    </main>
  );
};

/*Prop-Driven State Syncing: The selectedOptions state inside the child component 
is initialized with the selectedValues prop passed by the parent. This means that when the component first loads, 
 the child knows what the initial selected values are,
 based on what the parent has passed. This is why you have: */
