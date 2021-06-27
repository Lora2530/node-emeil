const Joi = require("joi");
const { MongoServerSelectionError } = require("mongodb");

const schemaCreateContact = Joi.object({
    name: Joi.string().alphanum().min(4).max(40).required(),

    email: Joi.string()
    .email({
        minDomainSegments: 3,
        tlds: { allow: ["com", "net"] },
    })
    .required(),

    phone: Joi.string()
    .pattern(/[(][0-9]{4}[)] [0-9]{4}-[0-9]{5}/)
    .min(10)
    .max(20)
    .required(), 
});

const schemaUpdateContact = Joi.object({
    name: Joi.string().alphanum().min(4).max(40).required(),

    email: Joi.string()
    .email({
        minDomainSegments: 3,
        tlds: { allow: ["com", "net"] },
    })
    .optional(),

    phone: Joi.string()
    .pattern(/[(][0-9]{4}[)] [0-9]{4}-[0-9]{5}/)
    .min(10)
    .max(20)
    .optional(), 
}).or("name", "email", "phone");

const schemaUpdateContact = Joi.object({
    favorite: Joi.boolean().optional(),
});

const valite = async (schema, obj, next) => {
    try {
        await schema.validateAsync(obj);
        next();
    } catch (err) {
        next({
            status: 400,
            massege: err.massege.replace(/"/g,""),
        });
    }
};

module.exports = {
    valitionCreateContact: (req, res, next) => {
        return valite(schemaCreateContact, req.body, next);
    },
    valitionUpdateContact: (req, res, next) => {
        return valite(schemaUpdateContact, req.body, next);
    },
    valitionUpdateStatusContact: (req, res, next) => {
        return valite(schemaUpdateStatusContact, req.body, next);
    },
    valitionMongoId: (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
            return next({
                status: 400,
                message: "Invalid ObjectId",
            });
        }
        next();
    },
};