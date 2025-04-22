const { readFilePromise } = require("./hostPromiseFs");

//-----------------------------------------    GET/READ ONE APARTMENT ---------------------//
exports.readOneApartment = (req, res, next) => {
  const id = req.params.id; // The ID from the request parameter.

  readFilePromise(res)
    .then((apartments) => {
      if (Array.isArray(apartments)) {
        const findApartment = apartments.find(
          (apartment) => apartment.id === id
        );
        if (findApartment) {
          // Check if the authenticated user is the host who created the apartment
          if (findApartment.createdBy.userId !== req.auth.userId) {
            return res.status(403).json({
              message: "You are not authorized to view this apartment",
            });
          }
          console.log("Found apartment:", findApartment);
          return res.status(200).json(findApartment); // Send the found apartment in response
        } else {
          console.log("Apartment not found.");
          return res.status(404).json({ message: "Apartment not found" });
        }
      } else {
        // 2. Handle the case where the data is neither an array nor an object
        console.log("Invalid data format.");
        return res.status(400).json({ message: "Invalid data format" });
      }
    })
    .catch((err) => {
      console.log("Cannot read the apartment", err);
      return res.status(500).json({ message: "Server error", error: err });
    });
};
