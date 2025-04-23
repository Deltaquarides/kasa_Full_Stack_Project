const express = require("express");
const app = express();
const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/user");
const hostRoutes = require("./routes/host");
const likeRoutes = require("./routes/user");
const mongoose = require("mongoose");
const path = require("path");
const { port, mongoURI } = require("./config"); //  import from config
//---------------------------CORS----------------------------------//

app.use((req, res, next) => {
  // in the older version it only allows http://localhost:3000, ==> res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  // but we can easily add more origins to the allowedOrigins array if necessary and
  //I've added a "if" statment to make sure only allowed origins can make requests.
  const allowedOrigins = ["http://localhost:3000"]; // Add more origins if necessary
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Send a response for the preflight request
  }
  next();
});
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use("/images", express.static(path.join(__dirname, "images")));

//--------------------------Mongoose-------------------------------------//

mongoose
  .connect(mongoURI, {
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDb connected !"))
  .catch((e) => console.log("MongoDB ERROR !", e.errmsg));

//--------------------------Routes-------------------------------------//
app.use("/api", homeRoutes);
app.use("/api/auth", userRoutes);
app.use("/api", hostRoutes); // Ensure protected routes are under this path
app.use("/api/logement/", likeRoutes);
//--------------------------Server-------------------------------------//
app.listen(port, () => {
  console.log(`listening on server http://localhost: ${PORT}`);
});

//module.exports = app;
