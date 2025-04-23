const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(v);
      },
      message: ({ value }) => `${value} is not a valid name.`,
    },
    required: [true, "Name required"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowerCase: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: ({ value }) => `${value} is not a valid email.`,
    },
    required: [true, "Please enter your mail adress"],
  },

  pwd: {
    type: String,
    require: [true, "Please Enter a valid password"],
    trim: true,
    maxlength: 72,
  },
  role: {
    type: String,
    enum: ["user", "host"], // Define valid roles
    default: "user", // Default to 'user' if no role is provided
  },
});

// Remove the plugin, no longer needed: since we don't use mongoose-unique validator
//due to conflict version of mongoose "^8.7.2",
//mongoose-unique-validator didn't catch up yet, stil in  4.0.1 version.
//userSchema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

//use of  Mongoose's pre save hook to automatically trim the fields and transform email to lowercase before they are saved to the database.
userSchema.pre("save", function (next) {
  this.name = this.name.trim();
  this.email = this.email.trim().toLowerCase();
  next();
});

module.exports = mongoose.model("User", userSchema);
