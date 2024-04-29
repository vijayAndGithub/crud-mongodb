const Joi = require('joi');
const httpStatus = require('http-status');
const { sendErrorResponse } = require('../utils/failure');


// Common Joi middleware for request validation
const validateRequest = (validationSchema) => (req, res, next) => {
    // Validate request body
    if (validationSchema.body) {
        const { error } = validationSchema.body.validate(req.body);
        if (error) {
            return sendErrorResponse(httpStatus.BAD_REQUEST, res, error.details[ 0 ].message)
        }
    }

    // Validate URL parameters
    if (validationSchema.params) {
        const { error } = validationSchema.params.validate(req.params);
        if (error) {
            return sendErrorResponse(httpStatus.BAD_REQUEST, res, error.details[ 0 ].message)
        }
    }

    // Validate query parameters
    if (validationSchema.query) {
        const { error } = validationSchema.query.validate(req.query);
        if (error) {
            return sendErrorResponse(httpStatus.BAD_REQUEST, res, error.details[ 0 ].message)
        }
    }

    // All validations passed, proceed to the next middleware or route handler
    next();
};

module.exports = validateRequest;
