import styled from "styled-components";

const Section = styled.section`
  display: flex;
  padding: 2rem 0;
`;

const Label = styled.label`
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1.5px dotted white;
  border-radius: 20px;
  width: 8rem;
  height: 8rem;
  cursor: pointer;
  font-size: large;
  color: white;
`;

const Span = styled.span`
  padding-top: 0.5rem;
  font-weight: lighter;
  font-size: large;
`;

const Input = styled.input`
  display: none;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ImageTag = styled.img`
  margin: 1rem 3rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 3px 2px 0px;
  border-radius: 1rem;
`;

const Button = styled.button`
  cursor: pointer;
  border: none;
  color: white;
  background-color: lightcoral;
  &:hover {
    background-color: rgba(182, 65, 19, 0.76);
  }
`;

const BulletPont = styled.p`
  position: absolute;
  z-index: 1;
  left: 21%;
  bottom: 1%;
  font-weight: bold;
`;

export const SelectMultipleImage = ({
  selectedImages,
  setSelecteImages,
  currentIndex,
  setCurrentIndex,
}) => {
  const handleSelectFile = (e) => {
    const selectedFiles = e.target.files;
    const selectedFilesArray = Array.from(selectedFiles); // Convert FileList to an array
    /*const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });*/
    setSelecteImages((prevImages) => [...prevImages, ...selectedFilesArray]);
  };

  const nextImage = () => {
    setCurrentIndex(
      currentIndex === selectedImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex(
      currentIndex === 0 ? selectedImages.length - 1 : currentIndex - 1
    );
  };

  const deleteImage = (image) => {
    setSelecteImages((prevImages) => prevImages.filter((e) => e !== image));
    // If the image being deleted is the current one, move to the previous image
    if (image === selectedImages[currentIndex] && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Section style={{ display: "flex" }}>
      <Label htmlFor="images">
        {" "}
        Add apartment image
        <br /> <Span>+ Up to 6 images</Span>
      </Label>
      <Input
        type="file"
        id="images"
        name="images"
        multiple
        accept="image/png, image/jpeg"
        onChange={handleSelectFile}
      />
      {/*if there's exactly one image  it renders just the image in a container. */}
      {selectedImages.length === 1 ? (
        <ImageContainer>
          <div>
            <ImageTag
              src={URL.createObjectURL(selectedImages[currentIndex])} // to display the image used of  URL.createObjectURL() to generate temporary URLs for the images when they are displayed.
              alt="apartment pics upload"
              height="100"
              width="100"
            />
          </div>
          <Button onClick={() => deleteImage(selectedImages[currentIndex])}>
            Delete Image
          </Button>
        </ImageContainer>
      ) : selectedImages.length > 1 ? ( //if there's more than one image  it renders the slideshow (with navigation and delete buttons)
        <div>
          <ImageContainer>
            <div>
              <BulletPont>
                {currentIndex + 1} of {selectedImages.length}
              </BulletPont>
              <ImageTag
                src={selectedImages[currentIndex]}
                alt="apartment pics upload"
                height="100"
                width="100"
              />
            </div>
            <div>
              <button type="button" onClick={prevImage}>
                Previous
              </button>
              <button type="button" onClick={nextImage}>
                Next
              </button>
              <Button onClick={() => deleteImage(selectedImages[currentIndex])}>
                Delete Image
              </Button>
            </div>
          </ImageContainer>
        </div>
      ) : //If there are no images, it renders nothing (null).
      null}
    </Section>
  );
};
