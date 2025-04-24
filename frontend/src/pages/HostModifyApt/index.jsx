import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { HostAptForm } from "../../components/HostAptForm";
import { useFetch } from "../../utils/hook";
import { LoaderSpinner } from "../../components/LoaderSpinner";

export const HostModifyApt = () => {
  // Method use for fetch is PUT to modify.
  // Need id by accessing params
  // 1st Fetch to load the current apartment data when the component mounts and pass it into HostAptForm as initialData
  // 2nd Fetch to Put method, modify the data

  const { id } = useParams();
  const jwtToken = localStorage.getItem("jwtToken"); // Retreive the token from localStorage before making the fetch request
  // Have all of the form data inside due to handleUpdate who is the form submission handler.
  // Used to trigger fetch
  const [formData, setFormData] = useState(null);

  //---------------- GET REQUEST--------------------//
  //hook useMemo to store: method, headers, and body, useMemo ensure reference is stable across renders.
  const options = useMemo(() => {
    return {
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "", // Replace with the actual token or credentials
      },
    };
  }, [jwtToken]);

  const { data, error, isLoading } = useFetch(
    `http://localhost:8080/api/host-only/${id}`,
    options
  );

  //---------------- POST REQUEST--------------------//

  const putOptions = useMemo(() => {
    if (!formData) return null;
    return {
      method: "PUT",
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "", // Replace with the actual token or credentials
      },
      body: formData,
    };
  }, [formData, jwtToken]);

  //self explanatory to changes those const to avoid duplicate.
  const {
    data: updateResponse,
    error: putError,
    isLoading: putLoading,
  } = useFetch(`http://localhost:8080/api/host-only/${id}`, putOptions);

  // 🔘 Form submission handler
  const handleUpdate = (dataToSend) => {
    setFormData(dataToSend); // triggers PUT via useMemo + useFetch
  };

  //-------------------------------- END ---------------------------//

  if (isLoading) return <LoaderSpinner />;
  if (error) return <p style={{ color: "red" }}>Erreur chargement: {error}</p>;
  return (
    <main
      style={{
        height: "80%",
        backgroundColor: "grey",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {" "}
      <HostAptForm
        initialData={data} //  pre-fill form
        onSubmit={handleUpdate} //modify handler
        submitButtonText="Update Apartment"
        titleForm=" Effectuer les modifications nécessaires"
      />
      {/* 👇 PUT fetch result after form submission */}
      {putLoading && <LoaderSpinner />}
      {putError && (
        <p style={{ color: "red" }}>Erreur mise à jour : {putError}</p>
      )}
      {updateResponse && <p>Réponse : {JSON.stringify(updateResponse)}</p>}
    </main>
  );
};
