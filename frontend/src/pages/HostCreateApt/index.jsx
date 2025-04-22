/*
collection9@exemplo.us
collection9
collection9POI+

*/
import { HostAptForm } from "../../components/HostAptForm";

export const HostCreateApt = () => {
  const jwtToken = localStorage.getItem("jwtToken"); // Retreive the token from localStorage before making the fetch request

  const handleCreate = (formData) => {
    fetch("http://localhost:8080/api/host-only", {
      method: "POST",
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
    </main>
  );
};

/*Prop-Driven State Syncing: The selectedOptions state inside the child component 
is initialized with the selectedValues prop passed by the parent. This means that when the component first loads, 
 the child knows what the initial selected values are,
 based on what the parent has passed. This is why you have: */
