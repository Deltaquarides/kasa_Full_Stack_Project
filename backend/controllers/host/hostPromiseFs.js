const fs = require("fs");

exports.readFilePromise = (res) => {
  return new Promise((resolve, reject) => {
    // wait the result of readfile
    fs.readFile("apartmentList.json", "utf8", function (err, data) {
      // if pb reading the file reject() otherwise we resolve() with the data.
      if (err) {
        // Handle the case when the file doesn't exist
        if (err.code === "ENOENT") {
          return resolve([]); // Return an empty array if the file does not exist
        }
        return reject(res.status(404).json({ message: "File not found", err }));
      }

      try {
        // If the file exists but is empty, resolve with an empty array
        const updatedDate = data ? JSON.parse(data) : [];
        return resolve(updatedDate);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return reject(
          res.status(500).json({
            message: "Error parsing apartment data",
            error: parseError.message,
          })
        );
      }
    });
  });
};

exports.writeFilePromise = (updatedData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "apartmentList.json",
      JSON.stringify(updatedData, null, 2),
      function (writeErr) {
        if (writeErr) {
          console.error("Error writing the file", writeErr);
          // if pb reading the file reject() otherwise we resolve() with the data.
          return reject(
            res.status(err.statusCode || 500).json({
              message: err.message || "Internal server error",
              error: err.error || err,
            })
          );
        }

        return resolve();
      }
    );
  });
};
