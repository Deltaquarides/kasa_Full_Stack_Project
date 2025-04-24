import homeBanner from "../../assets/images/homeBanner.png";
import { useState, useMemo, useEffect } from "react";
import { Gallery } from "../../components/Gallery";
import { Banner } from "../../components/Banner";
import styled from "styled-components";
import { useFetch } from "../../utils/hook";
import { LoaderSpinner } from "../../components/LoaderSpinner";

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

  // Memoize the fetch request options if needed (for customization)
  const options = useMemo(() => ({ method: "GET" }), []);

  // Use the custom useFetch hook to fetch data
  const { data, error, isLoading } = useFetch(url, options);

  // State to hold the apartment list after the data is fetched
  const [items, setItems] = useState([]);

  // State to handle any additional errors in the component (not related to fetch)
  const [isError, setIsError] = useState(null);

  // Effect hook to handle data processing after the fetch
  useEffect(() => {
    if (data) {
      // Check if the response structure is valid
      if (data.message && Array.isArray(data.apartmentList)) {
        setItems(data.apartmentList); // Update the apartment list
      } else {
        setIsError(
          "Invalid response format: apartmentList missing or malformed"
        );
      }
    }
  }, [data]);

  return (
    <MainStyl>
      <Banner
        img={homeBanner}
        title="Chez vous, partout ailleurs"
        height="250px"
      />
      {/* Conditional rendering based on loading or error states */}
      {isLoading && (
        <p>
          <LoaderSpinner />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Gallery
        error={isError}
        items={items}
        titleField="title"
        coverField="cover"
        linkPath="/logement/:id"
      />
    </MainStyl>
  );
};
