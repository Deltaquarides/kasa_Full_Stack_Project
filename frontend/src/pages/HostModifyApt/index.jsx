import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HostAptForm } from "../../components/HostAptForm";

export const HostModifyApt = () => {
  // Method use for fetch is PUT to modify.
  // Need id by accessing params
  // 1st Fetch to load the current apartment data when the component mounts and pass it into HostAptForm as initialData
  // 2nd Fetch to Put method, modify the data

  const { id } = useParams();
  const jwtToken = localStorage.getItem("jwtToken"); // Retreive the token from localStorage before making the fetch request
  const [apartment, setApartment] = useState(null); // holds pre-filled form data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/host-only/${id}`, {
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setApartment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load apartment:", err);
        setLoading(false);
      });
  }, [id, jwtToken]);

  const handleUpdate = (formData) => {
    fetch(`http://localhost:8080/api/host-only/${id}`, {
      method: "PUT",
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "", // Replace with the actual token or credentials
      },
      body: formData,
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
      });
  };

  if (loading) return <p>Loading...</p>;

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
        initialData={apartment} //  pre-fill form
        onSubmit={handleUpdate} //modify handler
        submitButtonText="Update Apartment"
        titleForm=" Effectuer les modifications nécessaires"
      />
    </main>
  );
};
