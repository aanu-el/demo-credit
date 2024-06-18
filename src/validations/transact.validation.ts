import Joi from 'joi';

export const transferSchema = Joi.object({
    toUserUuid: Joi.string()
        .required()
        .messages({
            'string.empty': 'recipient user uuid is required'
        }),

    amount: Joi.number().required()
});

export const withdrawSchema = Joi.object({
    recipient_account: Joi.number().required(),
    recipient_bank: Joi.string().required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().optional()
});

export const fundWalletSchema = Joi.object({
    amount: Joi.number().positive().required(),
    description: Joi.string().optional()
});
