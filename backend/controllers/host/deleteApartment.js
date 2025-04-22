const { readFilePromise, writeFilePromise } = require("./hostPromiseFs");

//------------------------------------  DELETE/DELETE APARTMENT  ---------------------//

/* pb:
    The challenge here is to delete images from the file system using:
      - recreate the path of the file system, to delete the file on the server.
      - the fs.unlink method of fs package.
      - fs.existsSync method to check if a file exist at a given path, return true or false.

*/
exports.deleteApartment = (req, res, next) => {
  const id = req.params.id; // The ID from the request parameter.

  readFilePromise(res)
    .then((updatedData) => {
      // Check if no apartment with the given id was found, if not=> error.
      // Otherwise "Apartment Deleted successfully!" will always be returned.
      const apartmentToDelete = updatedData.find(
        // apartmentToDelete contains the specific apartment.
        (apartment) => apartment.id === id
      );

      if (!apartmentToDelete) {
        return res.status(404).json({ message: "Apartment not found" });
      }

      // Check if the authenticated user is the one who created the apartment.
      if (apartmentToDelete.createdBy.userId !== req.auth.userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this apartment" });
      }

      //-----------  Handle remove picture covert selectedImages----------------//

      // If apartment has a cover image, delete it
      // apartmentToDelete.cover: is the url saved in the JSON file, it's the url of the images that can be view in the browser.
      // oldCoverPath: is the file system path that is needed to be deleted on the server.
      if (apartmentToDelete.cover) {
        const fileName = apartmentToDelete.cover.split("images/")[1];
        if (fileName) {
          fs.unlink(`images/${fileName}`, (err) => {
            if (err) {
              return res.status(500).json({
                message: "Error deleting the cover image",
                error: err,
              });
            }
            return res.status(200).json({ message: "cover deleted!" });
          });
        } else {
          res.status(400).json({ message: "Invalid cover file path" });
        }
      }

      // If apartment has a picture, delete it.
      if (apartmentToDelete.picture) {
        const oldPicturePath = path.join(
          "images",
          apartmentToDelete.picture.split("/images/")[1]
        );

        fs.unlink(oldPicturePath, (err) => {
          if (err) {
            return res.status(500).json({
              message: "Error deleting the picture image",
              error: err,
            });
          }
          return res.status(200).json({ message: "picture deleted!" });
        });
      }

      // If apartment has selectedImages, delete each one
      if (Array.isArray(apartmentToDelete.selectedImages)) {
        apartmentToDelete.selectedImages.forEach((img) => {
          const fileName = img.split("images/")[1]; // Extract the correct file name from each image URL
          if (fileName) {
            fs.unlink(`images/${fileName}`, (err) => {
              if (err) {
                return res.status(500).json({
                  message: "Error deleting selected images",
                  error: err,
                });
              }
              // If deletion is successful, send a response
              return res
                .status(200)
                .json({ message: "selected images deleted!" });
            });
          } else {
            // If the file name is invalid, send a 400 error response
            res
              .status(400)
              .json({ message: "Invalid selected images file path" });
          }
        });
      } else {
        // If selectedImages is not an array or is empty, send a 400 error response
        return res.status(400).json({
          message: "No selected images to delete",
        });
      }
      //-----------------------------------------------------------------------//

      // Filter out the apartment with the specified ID.
      // "updatedApartements" contain all arrays without the apartement filtered.
      const updatedApartements = updatedData.filter(
        (apartment) => apartment.id !== id
      );
      writeFilePromise(updatedApartements);
    })
    .then((updatedApartements) => {
      res.status(200).json({
        message: "Apartment Deleted successfully!",
        apartment: updatedApartements,
      });
    })
    .catch((err) => {
      console.log("Error deleting apartment:", err);
      res.status(500).json({ message: "Server error", error: err });
    });
};
