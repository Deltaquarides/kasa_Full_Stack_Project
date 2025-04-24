import { useMemo } from "react";
import { useFetch } from "../../utils/hook";
import { Gallery } from "../../components/Gallery";
import { LoaderSpinner } from "../../components/LoaderSpinner";

export const HostAllApt = () => {
  const jwtToken = localStorage.getItem("jwtToken"); // Retreive the token from localStorage before making the fetch request
  const url = `http://localhost:8080/api/host-only/read`;

  //---------------- GET REQUEST--------------------//
  //hook useMemo to store: method, headers, and body, useMemo ensure reference is stable across renders.
  const options = useMemo(() => {
    return {
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "", // Replace with the actual token or credentials
      },
    };
  }, [jwtToken]);

  const { data, error, isLoading } = useFetch(url, options);

  return (
    <>
      {isLoading && <LoaderSpinner />}
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}

      <Gallery
        error={error}
        items={data}
        titleField="title"
        coverField="cover"
        linkPath="/host-only/modify-apartment/:id"
      />
    </>
  );
};
