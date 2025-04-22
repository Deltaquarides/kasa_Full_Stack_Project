const { readFilePromise } = require("../controllers/host/hostPromiseFs");

exports.userReadOneApt = (req, res, next) => {
  const id = req.params.id; // id of the apartment;

  readFilePromise(res)
    .then((apartments) => {
      const findApartment = apartments.find((apartment) => apartment.id === id);
      return res.status(200).json({ apartmentList: findApartment }); // Send the found apartment in response
    })
    .catch((err) => {
      return res.status(500).json({ message: "Server error", error: err });
    });
};
