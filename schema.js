// joi me jo schema pass karege vo  hamare mongoose ka schema nahi hoga vo hamare server side validation ka schema hoga
const Joi = require('joi');                                 // Requiring joi (Schema valdiation tool)

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title   :   Joi.string().required(),
        description :   Joi.string().required(),
        location    :   Joi.string().required(),
        country :   Joi.string().required(),
        price   :   Joi.number().required().min(0),
        image   :   Joi.string().allow("",null)
    }).required()
}) ;

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating  :   Joi.number().required().min(1).max(5),
        comment :   Joi.string().required(),
    }).required()
})