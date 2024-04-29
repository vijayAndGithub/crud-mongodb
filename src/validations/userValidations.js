const Joi = require('joi');

const createUser = {
    body: Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9@#]{8,30}$')),
        account_type: Joi.string().valid('admin', 'user').required().pattern(new RegExp('^[a-zA-Z0-9@#]{8,30}$')),
        status: Joi.string().valid('active', 'inactive').required().pattern(new RegExp('^[a-zA-Z0-9@#]{8,30}$')),
        ViewAccess: Joi.boolean().required(),
        CreateAccess: Joi.boolean().required(),
        EditAccess: Joi.boolean().required(),
        DeleteAccess: Joi.boolean().required(),
    }),

}
const updateUser = {
    params: Joi.object({
        userId: Joi.string().required(),
    }),
    body: Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9@#]{8,30}$')),
        account_type: Joi.string().valid('admin', 'user').required().pattern(new RegExp('^[a-zA-Z0-9@#]{8,30}$')),
        status: Joi.string().valid('active', 'inactive').required().pattern(new RegExp('^[a-zA-Z0-9@#]{8,30}$')),
        ViewAccess: Joi.boolean().required(),
        CreateAccess: Joi.boolean().required(),
        EditAccess: Joi.boolean().required(),
        DeleteAccess: Joi.boolean().required(),
    }),

}
const changeStatus = {
    params: Joi.object({
        userId: Joi.string().required(),
    }),
    body: Joi.object({
        status: Joi.string().valid('active', 'inactive').required().pattern(new RegExp('^[a-zA-Z0-9@#]{8,30}$')),
    }),

}
const getUser = {
    params: Joi.object({
        userId: Joi.string().required(),
    })
}
const deleteUser = {
    params: Joi.object({
        userId: Joi.string().required(),
    })
}


module.exports = {
    createUser,
    updateUser,
    getUser,
    deleteUser,
    changeStatus,
}