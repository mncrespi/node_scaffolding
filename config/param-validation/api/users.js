import Joi                      from 'joi'

export default {
  // POST /api/users
  createUser: {
    body: {
      name: Joi.string().required(),
      surname: Joi.string().required(),
      email: Joi.string()
        .regex(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)
        .required(),
      username: Joi.string().required(),
      password: Joi.string()
        .regex(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
        .required(),
      mobile_number: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required(),
    },
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      name: Joi.string().required(),
      surname: Joi.string().required(),
      email: Joi.string()
        .regex(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)
        .required(),
      username: Joi.string().required(),
      password: Joi.string()
        .regex(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
        .required(),
      mobile_number: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required(),
    },
    params: {
      userId: Joi.string().hex().required(),
    },
  },
}
