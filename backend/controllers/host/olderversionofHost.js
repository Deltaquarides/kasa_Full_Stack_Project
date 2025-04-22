const fs = require("fs");
const Joi = require("joi"); // data validation library and schema.

//-------------------   CREATE   -------------------------//

exports.createApartment = (req, res, next) => {
  // Function to generate a custom unique ID
  function generateCustomId() {
    return (
      "id_" +
      Math.random().toString(36).substring(2, 9) +
      Date.now().toString(36).substring(-4)
    );
  }

  const apartmentSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    location: Joi.string().required(),
    selectedItems: Joi.array().items(Joi.string()).required(),
    picture: Joi.string().uri().required(),
    selectedImages: Joi.array().items(Joi.string().uri()).required(),
    createdAt: new Date(), // Add a timestamp for when the apartment is created
  });

  const apartmentData = {
    id: generateCustomId(), // generated id
    ...req.body, // spread operator = title,description,tags,location... all values from req.body.
    createdAt: new Date(), // Add a timestamp for when the apartment is created
  };

  const { error } = apartmentSchema.validate(req.body);

  console.log(req.body);
  // Handling errors if the apartmentSchema is not validate properly.
  if (error) {
    console.log("Invalid data structure", error);
    return res.status(400).json({
      message: "Invalid data",
      error: error.details[0].message,
    });
  }
  console.log("apartment data save successfully!");
  res.json({
    message: "Apartment added succesfully",
    apartment: apartmentData,
  });

  //-- read the  current apartment data from the file.
  fs.readFile("apartmentList.json", "utf8", function (err, data) {
    let apartments = [];

    //Handle errors is the file path is not found and if error reading the File.
    if (err) {
      fs.writeFile(
        "apartmentList.json",
        JSON.stringify(apartments),
        function (err, file) {
          if (err) throw err;
          console.log("Saved!");
        }
      );
      if (err.code === "ENONENT") {
        console.error("File not found:", err.path);
        res.status(404).json({ message: "File not found" });
        // File doesn't exist, we create an empty array to store apartments
        apartments = [];
      } else {
        console.log("Error reading the File", err);
        return res.status(500).json({
          message: "Internal server error while reading the apartment list",
          error: err.message,
        });
      }
    } else {
      // If the file contains data, parse it, otherwise initialize an empty array.
      // when parsing must be inside a try catch to handle potential parsing error.
      if (data) {
        try {
          apartments = JSON.parse(data);
        } catch (parseError) {
          console.log("Error parsing JSON", parseError);
          return res.status(500).json({
            message: "Error parsing apartment data",
            error: parseError.message,
          });
        }
      }
    }

    // Check if apartments is an array before pushing the new apartment
    if (!Array.isArray(apartments)) {
      console.error("Apartments is not an array");
      return res.status(500).json({
        message: "Internal error: apartments data is not an array",
      });
    }

    // Add the new apartment to the array
    apartments.push(apartmentData);

    // Convert the apartment data to JSON string with pretty formatting.
    const updateData = JSON.stringify(apartments, null, 2);

    // Write the updated array back to the file.
    fs.writeFile("apartmentList.json", updateData, function (writeErr) {
      if (writeErr) {
        console.error("Error writing the file", writeErr);
        return res.status(500).json({
          message: "Error saving the apartment data",
          error: writeErr.message,
        });
      }
      console.log("Apartment data saved succesfully!");
      return res.json({
        message: "Apartment added succesfully!",
        apartment: apartmentData,
      });
    });
  });
};

//---------------------    GET/READ ALL APARTMENT   ------------------------------//

exports.readAllApartment = (req, res, next) => {
  // Use fs.readFile() method to read the current data from the file
  fs.readFile("apartmentList.json", "utf8", function (err, data) {
    if (err) {
      if (err.code === "ENOENT") {
        console.error("File not found:", err.path);
        return res.status(404).json({ message: "File not found" });
      }
      console.log("Error reading the file", err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }
    // Display the file content
    const apartments = JSON.parse(data);

    console.log(apartments);
    return res.json({
      message: "Reading Apartment succesfully",
      apartment: apartments,
    });
  });
};

//------------------    GET/READ ONE APARTMENT ---------------------//
exports.readOneApartment = (req, res, next) => {
  fs.readFile("apartmentList.json", function (err, data) {
    const id = req.params.id; // The ID from the request parameter

    // 1. error handling to check if the file is read properly.
    if (err) {
      console.error("Error reading the file:", err);
      return res.status(500).send("Internal server error");
    }

    // 2. use of try catch to ensure the JSON is parse correctly.
    let apartments;
    try {
      apartments = JSON.parse(data); // Parse the file contents into a JavaScript object
    } catch (parseError) {}
    // Debug: Check the type of apartments after parsing
    //console.log("Type of apartments:", typeof apartments); // Should be 'object' if it's a single object
    //console.log("Apartments object:", apartments);

    // 3. Check if apartments is a single object
    if (typeof apartments === "object") {
      if (apartments.id === id) {
        console.log("Found apartment:", apartments);
        return res.status(200).json(apartments); // Send the found apartment in response
      } else {
        console.log("Apartment not found.");
        return res.status(404).send("Apartment not found");
      }
      //check if apartments is an array
    } else if (Array.isArray(apartments)) {
      const findApartment = apartments.find((apartment) => apartment.id === id);
      if (findApartment) {
        console.log("Found apartment:", findApartment);
        return res.status(200).json(findApartment); // Send the found apartment in response
      } else {
        console.log("Apartment not found.");
        return res.status(404).send("Apartment not found");
      }
    } else {
      // Handle the case where the data is neither an array nor an object
      console.log("Invalid data format.");
      return res.status(400).send("Invalid data format");
    }
  });
};

//---------------------  PUT/ MODIFY APARTMENT ----------------------//
exports.modifyApartment = (req, res, next) => {
  const id = req.params.id; // The ID from the request parameter.
  fs.readFile("apartmentList.json", "utf8", function (err, data) {
    let apartments;
    if (err) {
      console.error("Error reading the file:", err);
      return res.status(500).send("Internal server error");
    } else {
      try {
        apartments = JSON.parse(data);
      } catch (parseError) {
        console.log("Error parsing JSON", parseError);
        return res.status(500).json({
          message: "Error parsing apartment data",
          error: parseError.message,
        });
      }
    }
    //The map() method is used to iterate over the apartments and update the one
    // that matches the given id.The req.body (which contains the updated fields) is merged with the old one.
    // If there are any overlapping properties, the properties from req.body will overwrite the properties from apartment.
    const updatedApartments = apartments.map((apartment) => {
      if (apartment.id === id) {
        return { ...apartment, ...req.body };

        //-------Without destructuring-------//
        //apartment.title = req.body.title || apartment.title;
        //apartment.description = req.body.description || apartment.description;
        //apartment.tags = req.body.tags || apartment.tags;
        //apartment.location = req.body.location || apartment.location;
        //apartment.selectedItems = req.body.selectedItems || apartment.selectedItems;
        //apartment.picture = req.body.picture || apartment.picture;
        //apartment.selectedImages = req.body.selectedImages || apartment.selectedImages;
      }
      return apartment;
    });
    // we check if the apartment was updated with the find method.
    // If no apartment with the given id was found, a 404 error is returned.
    const updatedApartment = updatedApartments.find(
      (apartment) => apartment.id === id
    );
    if (!updatedApartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    const updateData = JSON.stringify(updatedApartments, null, 2);

    fs.writeFile("apartmentList.json", updateData, function (writeErr) {
      if (writeErr) {
        console.error("Error writing to file:", writeErr);
        return res.status(500).send("Internal server error");
      }

      // Send a success response with the updated apartment data
      return res.status(200).json({
        message: "Apartment updated successfully",
        apartment: updatedApartment,
      });
    });
  });
};

//---------------------  DELETE/DELETE APARTMENT  ---------------------//
exports.deleteApartment = (req, res, next) => {
  fs.readFile("apartmentList.json", "utf8", function (err, data) {
    const id = req.params.id; // The ID from the request parameter.
    let apartments = JSON.parse(data);

    const updatedApartements = apartments.filter(
      (apartment) => apartment.id !== id
    );
    console.log(updatedApartements);

    fs.writeFile(
      "apartmentList.json",
      JSON.stringify(updatedApartements, null, 2),
      function (writeErr) {
        if (writeErr) {
          console.error("Error deleting the apartment:", writeErr);
          return res.status(500).send("Internal server error");
        }

        // Send a success response with the updated apartment data
        return res.status(200).json({
          message: "Apartment deleted successfully",
          updatedApartements,
        });
      }
    );
  });
};
