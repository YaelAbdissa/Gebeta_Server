const Joi = require('joi');

exports.validatRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        loginUser: () => 
            Joi.object({
                email : Joi.string().email().required(),
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
            }),
        createUser: () => 
            Joi.object({
                name: Joi.string(),
                phone_no: Joi.string(),
                email: Joi.string().email(),
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))           
            })
    }
    try 
    {
       const {error } =  validationObjects[schemaName]().validate(req.body)
       if(!error) {
           return next();
       }
       throw new Error(error)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}
