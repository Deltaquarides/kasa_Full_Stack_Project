import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { SlideShow } from "../../components/SlideShow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Collapse } from "../../components/Collapse";
import { Tags } from "../../components/Tags";
import { Cards } from "../../components/Cards";
import { Button } from "../../components/Button";

const SlideShowSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-right: 20px;
  margin-left: 20px;
  justify-content: center;
  align-items: center;
`;
const DetailsApartmentSection = styled.section`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  @media screen and (min-width: 1054px) {
    display: flex;
    flex-direction: row;
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 20px;
  @media screen and (max-width: 319px) {
    flex-wrap: wrap;
  }
`;

const CardRatingContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  @media screen and (min-width: 1054px) {
    flex-direction: column-reverse;
  }
  @media screen and (min-width: 318px) {
    flex-wrap: unset;
  }
  @media screen and (width <317px) {
    flex-wrap: wrap;
  }
`;

const RatingWrapper = styled.div`
  display: flex;
  gap: clamp(0rem, 2vw, 1.2rem);
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  @media screen and (max-width: 320px) {
    right: 69px;
    top: 50px;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: rgb(194, 167, 164);
  font-size: clamp(15px, 5vw, 25px);
  ${(props) =>
    props.$emptyStars &&
    `                       
       color: rgb(255, 114, 97);

      `}
`;

const CollapseSection = styled.section`
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 35px;
  display: flex;
  gap: 2rem;
  @media screen and (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

// Méthode find, on compare l'id en params avec les id de la liste des appartements
//pour ciblé l'appartement lors du clique de l'utilisateur.
export const DetailsApartment = () => {
  const { id } = useParams();
  const url = `http://localhost:8080/api/logement/${id}`;
  const navigate = useNavigate();
  const [selectData, setSelectData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          console.error("Network response problem!", res);
          setError("Failed to fetch data");
          return; // Simply return without proceeding further
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.apartmentList) {
          // Set the data if apartmentList exists
          setSelectData(data.apartmentList);
          console.log(data);
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
  }, [url]);

  // Redirect to 404 page if `selectData` is falsy
  useEffect(() => {
    if (selectData === false) {
      navigate("*"); //  will redirect the user to a fallback or 404 page
    }
  }, [selectData, navigate]); // Only run this effect when `selectData` changes

  // Les données ne seront pas disponibles au premier render, On gère donc le cas en renvoyant null
  // sinon message d'erreur: cannot read property of undefined.
  /*if (!selectData) {
    return null;
  }*/

  const gauges = [1, 2, 3, 4, 5];

  return (
    //Erreur: cannot read property of undefined.
    //Solution: on doit vérifier si selectData est définit avant d'accéder à ses propriétés. On utilise donc un opérateur
    //conditionnel pour render les éléments; titre, nom ... uniquement si selectData est définit.
    <>
      {error && <div>{error}</div>}
      {selectData && selectData.length > 0 && (
        <main style={{ height: "80%" }}>
          <SlideShowSection>
            <SlideShow specificApartment={selectData.selectedImages} />
          </SlideShowSection>
          <DetailsApartmentSection>
            <div>
              <div>
                <h1 style={{ color: "rgb(255, 114, 97)", margin: "0px " }}>
                  {selectData.title}
                </h1>
                <p style={{ color: "rgb(255, 114, 97)" }}>
                  {selectData.location}
                </p>
              </div>

              <TagsWrapper>
                <Tags content={selectData.tags} />
              </TagsWrapper>
            </div>
            <CardRatingContainer>
              <Button
                title=" vote  "
                onClick={() => navigate(`/logement/${id}/like`)}
              />
              <RatingWrapper>
                {gauges.map((gauge, index) =>
                  gauge > selectData.averageVote ? (
                    <span key={index}>
                      {<StyledFontAwesomeIcon icon={faStar} />}
                    </span>
                  ) : (
                    <span key={index}>
                      {" "}
                      {<StyledFontAwesomeIcon $emptyStars icon={faStar} />}
                    </span>
                  )
                )}
              </RatingWrapper>

              <CardContainer>
                <Cards
                  name={selectData.createdBy.userName}
                  pic={selectData.picture}
                />
              </CardContainer>
            </CardRatingContainer>
          </DetailsApartmentSection>

          <CollapseSection>
            <Collapse title="Description" content={selectData.description} />
            <Collapse
              title="Equipements"
              content={selectData.selectedItems.map((spec, index) => (
                <ul key={index} style={{ listStyle: "none" }}>
                  <li>{spec} </li>
                </ul>
              ))}
            />
          </CollapseSection>
        </main>
      )}
    </>
  );
};
