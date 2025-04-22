const { readFilePromise, writeFilePromise } = require("./hostPromiseFs");

/*
Pb:
 The challenge here is to update/change all the url's and replace all the modified images in the images folder.

Solution: 
 Following the same logic as createApartment controller we need to:
   Parse tags and selectedItems from JSON strings.
   Handle file uploads (cover, picture, selectedImages) properly using the same HandleUrl() logic.
   Validate the updated data with Joi using validateApartment.
   Preserve immutable fields like id, createdAt, and createdBy, and update only mutable fields.

   Parse tags, selectedItems, selectedImages because data is sent from the frontend
   as a FormData object, everything is sent as a string  (strings, files as blob)
   but need to stringify array and object. So we parse because in HandleUrl we are expecting arrays
   same for Joi validation expecting an array and "every()" works only on arrays.
   every() is a JavaScript array method that checks if every element in the array passes a test.
   “Is every item in req.body.selectedImages a valid URL?” const allAreUrls = req.body.selectedImages.every(isValidUrl)


  pb:
    the code don't handle if the user send for example and empty array or nothing at all.
    right now it replace the previous value par an empty array if the user senf an empty array []
    for ex: tags: [] <--empty

  solution:  nullish coalescing (??)
   1. add ternary operator line 46-52
      ex: req.body.tags = req.body.tags ? JSON.parse(req.body.tags) : undefined;
      meaning: is req.body.tags not undefined, null, or an empty string? if yes parse it as JSON if no  jst set to undefines so i won't crash.
      SO we nly parse tags if it was sent in the request. Otherwise, just leave it as undefined so we can skip or keep the previous value.
    2.and conditionally use the new values only if they exist:
    so that if the values is undefined or null it won't override the previous values ---> tags: req.body.tags ?? apartment.tags,
    line 156-158
*/

//-----------------------------------  PUT/ MODIFY APARTMENT ----------------------//
exports.modifyApartment = (req, res, next) => {
  const id = req.params.id; // The id from the request parameter.
  const fileBody = req.files; // access files from request
  let apartmentToModify; // variable that contains the specific apartment to modify.

  //----------Parse tags end selectedItems before validation---------//

  try {
    req.body.tags = req.body.tags ? JSON.parse(req.body.tags) : undefined;
    req.body.selectedItems = req.body.selectedItems
      ? JSON.parse(req.body.selectedItems)
      : undefined;
    req.body.selectedImages = req.body.selectedImages
      ? JSON.parse(req.body.selectedImages)
      : undefined; //
  } catch (error) {
    return res.status(400).json({
      message: "Invalid JSON format in tags or selectedItems",
      error: error.message,
    });
  }
  //-------------------------------------------------------//

  const fileFieldname = {
    cover: "cover",
    picture: "picture",
    selectedImages: "selectedImages",
  };

  //-------------------------  custom validator function  ------------------------------//
  function isValidUrl(str) {
    try {
      new URL(str); // try to create a URL object from the string.
      return true; // If it's work, it's a valid URL.
    } catch (_) {
      return false; // If of throws an error, it's not a valid URL.
    }
  }

  //--------  function to check values of files and return an url pointing at saved images  ----------//
  function HandleUrl(fileBody, fileName) {
    // Check for body value and return if it's already a URL
    if (req.body[fileName] && isValidUrl(req.body[fileName])) {
      return req.body[fileName]; // It's a full URL, use it as-is
    }

    if (fileName === "cover" || fileName === "picture") {
      return `${req.protocol}://${req.get("host")}/images/${
        fileBody[fileName][0].filename
      }`;
    } else if (fileName === "selectedImages") {
      if (req.body.selectedImages && Array.isArray(req.body.selectedImages)) {
        // If they're all URLs already
        const allAreUrls = req.body.selectedImages.every(isValidUrl);
        if (allAreUrls) {
          return req.body.selectedImages; // Already URLs
        }
      }
      return fileBody[fileName]?.map((file) => {
        return `${req.protocol}://${req.get("host")}/images/${file.filename}`;
      });
    } else {
      console.log("Invalid fileName provided.");
      return null;
    }
  }
  //-----------Generate new image URLs if new files are uploaded-----------//
  req.body.picture = HandleUrl(fileBody, fileFieldname.picture);
  req.body.cover = HandleUrl(fileBody, fileFieldname.cover);
  req.body.selectedImages = HandleUrl(fileBody, fileFieldname.selectedImages);
  console.log("req.body selectedImages", req.body.selectedImages);
  //-----------------------------------------------------------------------//

  readFilePromise(res)
    .then((data) => {
      const updatedApartments = data.map((apartment) => {
        if (apartment.id === id) {
          apartmentToModify = apartment;

          // Check user authorization
          if (apartment.createdBy.userId !== req.auth.userId) {
            throw {
              status: 403,
              message: "You are not authorized to modify this apartment",
            };
          }

          // Delete old files if new ones are uploaded
          if (newCover && apartment.cover) {
            const oldCoverPath = path.join(
              "images",
              apartment.cover.split("/images/")[1]
            );
            if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);
          }

          if (newPicture && apartment.picture) {
            const oldPicturePath = path.join(
              "images",
              apartment.picture.split("/images/")[1]
            );
            if (fs.existsSync(oldPicturePath)) fs.unlinkSync(oldPicturePath);
          }

          if (newSelectedImages && Array.isArray(apartment.selectedImages)) {
            apartment.selectedImages.forEach((img) => {
              const oldImagePath = path.join(
                "images",
                img.split("/images/")[1]
              );
              if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            });
          }

          // Merge updated data while keeping immutable fields
          const updatedApartment = {
            ...apartment,
            ...req.body,
            tags: req.body.tags ?? apartment.tags,
            selectedItems: req.body.selectedItems ?? apartment.selectedItems,
            selectedImages: newSelectedImages || apartment.selectedImages,
            cover: newCover || apartment.cover,
            picture: newPicture || apartment.picture,
          };

          // Validate the updated apartment
          const { error } = validateApartment(updatedApartment);
          if (error) {
            throw { status: 400, message: error.details[0].message };
          }

          return updatedApartment;
        }
        return apartment;
      });

      // Save updated data
      return writeFilePromise(updatedApartments).then(() => {
        res.status(200).json({
          message: "Apartment modified successfully!",
          apartment: apartmentToModify,
        });
      });
    })

    .catch((err) => {
      console.log("Cannot modify apartment:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};
