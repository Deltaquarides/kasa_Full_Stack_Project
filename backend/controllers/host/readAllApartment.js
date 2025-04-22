const { readFilePromise } = require("./hostPromiseFs");

//---------------------------------------    GET/READ ALL APARTMENT   ------------------------------//

exports.readAllApartment = (req, res, next) => {
  readFilePromise(res)
    .then((apartments) => {
      // Filter the apartments to include only those created by the authenticated host
      const userApartments = apartments.filter(
        (apartment) => apartment.createdBy.userId === req.auth.userId
      );

      if (userApartments.length === 0) {
        return res
          .status(404)
          .json({ message: "No apartments found for this host." });
      }
      return res.status(200).json({
        message: "Reading Apartment succesfully",
        apartment: userApartments,
      });
    })
    .catch((err) => {
      console.error("Error reading apartments:", err);
      return res.status(500).json({
        message: "An error occurred while retrieving apartments.",
        error: err.message || err,
      });
    });
};
