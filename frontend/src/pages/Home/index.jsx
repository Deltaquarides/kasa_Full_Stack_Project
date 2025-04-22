import homeBanner from "../../assets/images/homeBanner.png";
import { useState, useEffect } from "react";
import { Gallery } from "../../components/Gallery";
import { Banner } from "../../components/Banner";
import styled from "styled-components";

const MainStyl = styled.main`
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 40px;
  @media screen and (max-width: 480px) {
    margin: 20px;
  }
`;

export const Home = () => {
  const url = `http://localhost:8080/api/home`;

  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  // Here we are using the error state to handle differents errors
  // it's a different approch to "throw Error" we used in Register for ex.
  useEffect(() => {
    fetch(url)
      .then((res) => {
        // if response is !ok handle error
        if (!res.ok) {
          console.error("Network response problem!", res);
          setError("Failed to fetch apartments");
          return null; // Prevent further processing if the response is not ok
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // response of the back end (message,apartmentList).
        if (data.message && data.apartmentList) {
          setItems(data.apartmentList);
        } else {
          // handle error if the response structure is not as expected
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
    <MainStyl>
      <Banner
        img={homeBanner}
        title="Chez vous, partout ailleurs"
        height="250px"
      />
      <Gallery
        error={error}
        items={items}
        titleField="title"
        coverField="cover"
        linkPath="/logement/:id"
      />
    </MainStyl>
  );
};
