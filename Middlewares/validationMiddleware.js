const ApiError = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
 
    if (error) {
      const errors = error.details.map((err) => err.message);

      return next(
         new ApiError(400, errors.join(", "))
      );
    }

    next();
  };
};

module.exports = validate;