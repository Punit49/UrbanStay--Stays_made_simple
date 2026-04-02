const joi = require("joi");
const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).required();

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().allow("", null), 
        // owner: objectId.required()
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required().min(10).max(1000)
        // author: objectId.required()
    }).required()
});
