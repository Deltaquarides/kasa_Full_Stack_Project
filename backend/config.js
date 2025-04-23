/*
Since this app might get bigger and to explore another 
method for centralize environement variables:
creation of a module to exports and imports variables.
*/
require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || 3000,
  secretToken: process.env.MONGO_URI,
};
