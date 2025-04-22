const Joi = require("joi"); // data validation library and schema.

const apartmentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  selectedItems: Joi.array().items(Joi.string()).required(),
  tags: Joi.array().items(Joi.string()).required(),

  // picture, selectedImages, and cover should be URLs (strings) after Multer upload
  picture: Joi.string().required(),
  selectedImages: Joi.array().items(Joi.string().uri()).required(),
  cover: Joi.string().uri().required(),
  averageVote: Joi.number().min(0).max(5),
  voteCount: Joi.number().min(0), // Added voteCount validation, number of users who have voted.
  createdAt: Joi.date().default(() => new Date()), // Add a timestamp for when the apartment is created
  createdBy: Joi.object({
    userId: Joi.string().required(), //  userId is a string
    userName: Joi.string().required(), //  userName is a string
  }), //.required() is applied to the createdBy object itself
  // Add the voters field for tracking users' votes, because we don't want user to accumulate votes.
  voters: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(), // Validate that each voter has a userId
        vote: Joi.number().min(0).max(5).required(), // Validate that each vote is a number between 0 and 5
      })
    )
    .default([]), // Default to an empty array if no voters are present
});

// Export the schema and a validation function
const validateApartment = (data) => {
  return apartmentSchema.validate(data);
};

module.exports = {
  validateApartment,
};

/*
  //Automatically parse stringified arrays in backend
  tags: Joi.string().custom((value, helpers) => {
      // If the value is a string, attempt to parse it as JSON
      let parsedTags;
      if (typeof value === "string") {
        try {
          parsedTags = JSON.parse(value);
        } catch (error) {
          // If parsing fails, throw an error
          return helpers.error("any.invalid");
        }
      } else {
        parsedTags = value;
      }

      // Validate that parsedTags is an array of strings
      if (!Array.isArray(parsedTags)) {
        return helpers.error("any.invalid");
      }

      // Check that each element in the array is a string
      const allStrings = parsedTags.every((item) => typeof item === "string");
      if (!allStrings) {
        return helpers.error("any.invalid");
      }

      // Return the parsed array if everything is fine
      return parsedTags;
    }).required

      selectedItems: Joi.string()
    .custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return helpers.error("any.invalid");
        const allStrings = parsed.every((item) => typeof item === "string");
        if (!allStrings) return helpers.error("any.invalid");
        return parsed;
      } catch {
        return helpers.error("any.invalid");
      }
    })
    .required(),
*/
