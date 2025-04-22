import { useState, useEffect } from "react";
import styled from "styled-components";

import equipementData from "../../utils/listequipement.json";
import { ListingForm } from "../../components/ListingForm";
import { SelectMultipleImage } from "../../components/SelectMultipleImage";

const FormContainer = styled.div`
  padding: 1rem;
  border-radius: 40px;
  height: 996px;
  margin: 1rem;
  background-image: url("https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/front-end-kasa-project/accommodation-2-1.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  opacity: 0.7;
`;

const InputStylin = styled.input`
  padding: 0px 20px;
  border-radius: 10px;
  background: rgb(255 255 255 / 74%);
  border: none;
  color: white;
  line-height: 40px;
`;

const TitleForm = styled.h1`
  text-align: center;
  color: white;
  font-weight: bolder;
  font-size: clamp(2rem, 4vw, 4rem);
  text-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
`;

const UnderTtile = styled.h2`
  text-align: center;
  color: white;
  font-weight: bolder;
  text-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
  font-size: clamp(1.5rem, 2.5vw, 3.5rem);
`;

export const HostAptForm = ({
  initialData = {},
  onSubmit,
  submitButtonText,
  titleForm,
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [tags, setTags] = useState(initialData.tags || []);
  const [location, setLocation] = useState(initialData.location || "");

  const [options, setOptions] = useState([]);
  //parent component's state that holds the current list of selected options.
  //// It is passed to the child component as a prop (selectedValues).
  //The parent wants to keep track of the global state of selections
  // (e.g., the entire app needs to know what is selected).
  const [selectedItems, setSelectedItems] = useState(
    initialData.selectedItems || []
  );
  const [picture, setPicture] = useState(initialData.picture || "");
  const [selectedImages, setSelecteImages] = useState([]);
  const [cover, setCover] = useState(initialData.cover || "");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const equipmentOptions = equipementData.equipmentOptions.map(
      (equipment) => ({
        value: equipment,
        label: equipment,
      })
    );
    setOptions(equipmentOptions);
    console.log(equipmentOptions[0].value);
  }, []);

  //----------------------------------------------------------------------------//
  //Check for the file type before appending: prevent users from uploading unsupported file types.
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setPicture(file);
    } else {
      alert("Please upload a valid image (PNG or JPEG).");
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCover(file);
  };
  //--------------------------------------------------------------------------------//

  // To avoid repeating the prop names, we can use object destructuring in the parent component when passing them down to the child:
  const props = {
    selectedImages,
    setSelecteImages,
    currentIndex,
    setCurrentIndex,
  };

  const handleSelectionChange = (newSelectedValues) => {
    setSelectedItems(newSelectedValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedImages.length > 6) {
      alert("You can only upload up to 6 images.");
      return; // Exits the function here, so no data is sent to the server
    }

    //----------------------- Create an object containing the form data-----------------------//
    // formdata only supports strings and file and send it as strings stringify arrays objects
    //  ?? [] is the nullish coalescing operator. means if the value is null or undefined, use an empty array [] instead
    // Since in the backend we are parsing those values it ensures the backend always gets a valid JSON array, even if it's empty
    // in the front end prevents crashes trying to stringify undefined. ex: user didn't enter tags, formData.append("tags",JSON.stringify(undefined))

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);

    console.log("Before appending to formData", tags);
    const tagsArray = Array.isArray(tags) ? tags : tags.split(/[\s,]+/);
    formData.append("tags", JSON.stringify(tagsArray ?? [])); // If tags is null or undefined → stringify([])
    console.log("After appending to formData", tags);

    formData.append("selectedItems", JSON.stringify(selectedItems ?? [])); // Convert array to string since selectedItems is an array  // If tagsArray is null or undefined → stringify([])
    formData.append("picture", picture);
    formData.append("cover", cover);
    console.log();
    selectedImages.forEach(
      (image) =>
        formData.append("selectedImages", JSON.stringify(selectedItems ?? [])) // If selectedImages is null or undefined → stringify([])
    ); // Append selectedImages (multiple images) array individually

    onSubmit(formData); // onSubmit is a props from the HostCreatApt components

    //Log the FormData content using forEach
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  };
  //-------------------------------------------------------------//
  return (
    <>
      <FormContainer>
        <div style={{ height: "200px" }}>
          <TitleForm>{titleForm}</TitleForm>
          <UnderTtile>
            Veuillez remplir le formulaire suivant pour mettre à jour votre
            logement!
          </UnderTtile>
        </div>
        <form
          onSubmit={handleSubmit} // another onSubmit but here it's a event for the form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "auto",
            height: "60%",
            padding: "1rem",
            border: "inset",
            borderRadius: "10px",
            gap: "1rem",
            margin: "2rem",
          }}
        >
          <InputStylin
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <InputStylin
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <ListingForm
            options={options}
            selectedValues={selectedItems}
            onChange={handleSelectionChange}
            labelField="label"
            valueField="value"
            placeholder="Choose your options"
          />

          <label htmlFor="avatar">Choose your profile picture:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={handlePictureChange}
          />

          <InputStylin
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value.split(/[\s,]+/))}
            required
          />
          {/* -------------------------Add multiple image for user apartment----------------*/}
          <SelectMultipleImage {...props} />

          <label htmlFor="avatar">Choose your apatment cover:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={handleCoverChange}
          />

          <button type="submit">{submitButtonText}</button>
        </form>
      </FormContainer>
    </>
  );
};
