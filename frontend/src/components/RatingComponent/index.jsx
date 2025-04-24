/* I  Steps to implement a dynamical voting system.*/
// 1. Create an array of max 5 lenght, use the map method to render 5 stars, (font-awesome) or react-icons library.
// 2. Create radio buttons for each stars so we can easly capture the selected value,
//    radio buttons have build in behavior for form submission and keyboard navigation.
// 3. Stars value should be 1 to 5, const ratingValue = index + 1, ratingValue is affected to input value.
// 4. Store the current rating value in a useSate with onClick event
// ----- change the stars color when user click and hover: ---//
// 6. Since react icon have a color prop. change the color when cliked, ratingValue <= rating
// 7. when hovering change the color of the star and previous stars. Add a new state "hoverRating"
//    that tracks the current star being hovered over.
//    use of onMouseEnter and onMouseLeave events to dynamically change the state of the rating

/* II Implement the post request  */
// 1. Create a function named "postRating" that handle the post request
// 2. postRating have as prop rating value, this function will be call in the onClick event

import { useState, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useFetch } from "../../utils/hook";
import { LoaderSpinner } from "../LoaderSpinner";

const Star = styled(FontAwesomeIcon)`
  cursor: pointer;
  transition: color 0.3s ease;
`;

export const RatingComponent = () => {
  const { id } = useParams();
  const url = `http://localhost:8080/api/logement/${id}/like`;

  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null); // For hover effect

  // Memoize the fetch options to avoid unnecessary re-renders
  const options = useMemo(() => {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ratingValue: rating }), // Send the rating value as JSON
    };
  }, [rating]); // This will update whenever the rating value changes

  // Use the custom useFetch hook for posting the rating
  const { data, error, isLoading } = useFetch(url, options);

  // Handle the click event to set the rating and trigger the fetch
  const handleRatingClick = (ratingValue) => {
    setRating(ratingValue); // Set the rating when clicked
  };

  return (
    <>
      {[...Array(5)].map((star, index) => {
        //create an array of 5 empty undefined slots.
        const ratingValue = index + 1;
        const isHovered = hoverRating >= ratingValue; // Check if the star is hovered or rated

        return (
          <label>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleRatingClick(ratingValue)} // Set rating on click
              style={{ display: "none" }}
            />

            <Star
              icon={faStar}
              onMouseEnter={() => setHoverRating(ratingValue)} // used when the mouse enters a star
              onMouseLeave={() => setHoverRating(null)} // used when the mouse leaves the star to remove the hover effect
              color={
                isHovered || ratingValue <= rating
                  ? "rgb(255, 114, 97)"
                  : "rgb(194, 167, 164)"
              }
            />
          </label>
        );
      })}
      <span>{rating}</span>
      {isLoading && (
        <p>
          <LoaderSpinner />
        </p>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && <p>Response: {JSON.stringify(data)}</p>}
    </>
  );
};
