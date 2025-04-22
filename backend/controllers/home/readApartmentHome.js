const { readFilePromise } = require("../host/hostPromiseFs");

exports.readApartmentHome = (req, res, next) => {
  readFilePromise(res)
    .then((apartmentData) => {
      return res.status(200).json({
        message: "Reading Apartment succesfully",
        apartmentList: apartmentData,
      });
    })
    .catch((err) => {
      //console.error("Error reading apartment data:", err);
      return res.status(500).json({
        message: "An error occurred while retrieving apartment data.",
        error: err.message || "Internal server error",
      });
    });
};
