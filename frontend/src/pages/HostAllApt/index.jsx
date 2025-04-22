import { useEffect, useState } from "react";
import { Gallery } from "../../components/Gallery";

export const HostAllApt = () => {
  const [selectData, setSelectData] = useState(null);
  const [error, setError] = useState(null);

  const url = `http://localhost:8080/api/host-only/read`;

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken"); // Retreive the token from localStorage before making the fetch request

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "", // Replace with the actual token or credentials
        "Content-Type": "application/json", // If required by the API
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Network response problem!", res);
          setError("Failed to fetch data");
          return; // Simply return without proceeding further
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Data: ", data); // Add this line to inspect the response
        if (data && data.apartment) {
          // Set the data if apartmentList exists
          setSelectData(data.apartment);
          console.log(data.apartment);
        } else {
          setError(
            "Invalid response format: apartmentList missing or malformed"
          );
        }
      })
      .catch((err) => {
        // Handle any error that occurs during the fetch or data processing
        console.error("Error fetching apartment data:", err);
        setError("An error occurred while fetching apartment data");
      });
  }, []);

  return (
    <>
      <Gallery
        error={error}
        items={selectData}
        titleField="title"
        coverField="cover"
        linkPath="/host-only/modify-apartment/:id"
      />
    </>
  );
};
