const { validateApartment } = require("../../models/ApartmentValidation");
const { readFilePromise, writeFilePromise } = require("./hostPromiseFs");
const User = require("../../models/user");

//---------------------------------------------   CREATE   ------------------------------------------//

exports.createApartment = (req, res, next) => {
  /* 
  Pb: 
   "tags" and "selectedItems" was throwing an error in joi validation because it was a string
  Solution: in Joi schema create a custom function to parse string value to JSON
    let tags = req.body.tags;

  Explaination of Formadata: 
      Formdata limitations to understand tags end selectedItems error:
      FormData doesn't support nested data structures directly (like arrays or objects). 
      Everything sent via FormData.append() is a string or Blob. formData.append("tags", tags); // ⛔ won't work right
      This sends [object Object] or behaves inconsistently.
      That’s why JSON.stringify() is needed. And because the backend receives a string, the custom function becomes necessary.
  
     So even if tags is an array on the frontend, by the time it hits the backend it's stringify:
     since the SOLUTION to add custom function in the joi schema is quite messy and it's just a workaround 
     for FormData limitations, "simplify Joi by parsing the JSON string before calling validateApartment(req.body)" -line 48-58.
     return to the original syntaxe in joi schema: tags: 
     Joi.array().items(Joi.string()).required(),
     selectedItems: Joi.array().items(Joi.string()).required(),
  */

  /* 
   pb:
    selectedImages joi returning selectedImages[0]"" must not be a sparse array item",selectedImages:[undefined, undefined]
    cause: A sparse array is an array that has missing (or undefined) elements — meaning not every index has a value
   Solution: 
    forget a seconde return inside the map function of HandleUrl()
    HandleUrl() is returning an array with undefined values because it doesn't have a return inside the map() function,
    making it return undefined for each item.


    pb:
      Handling images that are already URLs rather than files being uploaded via req.files.
    Solution: 
      Create a custom validator function that test if a string is a valid url. Using the URl constructor.
      The Url constructor returns a newly created URL object reresenting the URL defined by the parameters.
      If the URL is not a valid URLs the javascript TypeError exeptions thrown, TYPEERROR [ERR_INVALID_URL]: Invalid URL,
      which means the app would crash unless catching it in a try catch.
      line 70-79
   */

  console.log("req.body BEFORE selectedImages", req.body.selectedImages);

  const fileBody = req.files;

  const fileFieldname = {
    cover: "cover",
    picture: "picture",
    selectedImages: "selectedImages",
  };

  //----------Parse tags end selectedItems JSON strings before validation---------//

  try {
    req.body.tags = JSON.parse(req.body.tags); // inject the parse tags to req.body
    req.body.selectedItems = JSON.parse(req.body.selectedItems); // inject the parse selectedItems to req.body
  } catch (error) {
    return res.status(400).json({
      message: "Invalid JSON format in tags or selectedItems",
      error: error.message,
    });
  }
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

  /* Pb: Was getting picture is not defined
     Cause: Since we are only passing req.body to joi validation function "validateApartment(req.body)"
   but "cover", "picture", "selectedImages" are  not in req.body but in req.files
     Solution: need to augment req.body with the picture, cover, and selectedImages values BEFORE validate.
   so we Add URLs to req.body before validation */
  req.body.picture = HandleUrl(fileBody, fileFieldname.picture);
  req.body.cover = HandleUrl(fileBody, fileFieldname.cover);
  req.body.selectedImages = HandleUrl(fileBody, fileFieldname.selectedImages);
  console.log("req.body selectedImages", req.body.selectedImages);

  //---------------------------------Joi validation function-----------------------------------------//
  // Use the imported validateApartment function to validate the incoming request body
  const { error } = validateApartment(req.body);

  // Handling errors if the apartmentSchema is not validate properly.
  if (error) {
    console.log("Invalid data structure", error);
    return res.status(400).json({
      message: "Invalid data",
      error: error.details[0].message,
    });
  }
  // -------------------Function to generate a custom unique ID--------------------//
  function generateCustomId() {
    return (
      "id_" +
      Math.random().toString(36).substring(2, 9) +
      Date.now().toString(36).substring(-4)
    );
  }
  //-----------------------------------------------------------------------------//

  const apartmentData = {
    id: generateCustomId(), // generated id
    ...req.body, // spread operator = title,description,tags,location... all values from req.body.
    createdAt: new Date(), // Add a timestamp for when the apartment is created
    createdBy: {
      userId: req.auth.userId, // Attach the userId of the authenticated host
      userName: req.auth.userName, // Add the userId of the authenticated host
    },
  };

  //----------- Read, update, and write apartment list-------------//
  readFilePromise(res)
    .then((apartments) => {
      const apartmentList = apartments || []; // If no apartments exist, initialize as an empty array

      apartmentList.push(apartmentData); // Add the new apartment to the list

      return writeFilePromise(apartmentList).then(() => apartmentData); // Save the updated apartment list to the file
    })
    .then((savedApartment) => {
      // Respond with success if the apartment is added
      res.status(200).json({
        message: "Apartment added successfully!",
        apartment: savedApartment,
      });
    })
    .catch((err) => {
      // Catch errors from reading or writing to the file
      if (err.status) {
        return res.status(err.status).json({
          message: err.message,
          error: err.error,
        });
      }
      console.error("Error creating apartment:", err);
      res.status(500).json({
        message: "Error saving apartment",
        error: err.message || err,
      });
    });
};
