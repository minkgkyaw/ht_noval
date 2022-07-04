import * as yup from "yup";
import joi from "joi";
import mongoId from "joi-objectid";

joi.objectId = mongoId(joi);

export const yupUserRegisterSchema = yup.object().shape({
  name: yup.string().min(3).max(60).required("Name is required!"),
  email: yup.string().email().trim().lowercase().required("Email is required!"),
  password: yup.string().min(6).max(60).required("Password is required"),
  confirm_password: yup
    .string()
    .min(6)
    .max(60)
    .required("Confirm password is required!")
    .oneOf([yup.ref("password"), null], "Password not match!"),
  role: yup.string().min(3).max(10).oneOf(["Admin", "Developer", "Helper"]),
});

export const joiUserRegisterSchema = joi.object().keys({
  name: joi.string().min(3).max(60).required(),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .trim()
    .lowercase()
    .required(),
  password: joi.string().min(6).max(60).required(),
  confirm_password: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .valid(joi.ref("password")),
  role: joi.string().valid("Admin", "Developer", "Helper"),
});

export const yupLoginSchema = yup.object().shape({
  email: yup.string().email().trim().lowercase().required("Email is required!"),
  password: yup.string().required("Password is required"),
});

export const joiLoginSchema = joi
  .object()
  .keys({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .trim()
      .lowercase()
      .required(),
    password: joi.string().min(6).max(60).required(),
  })
  .with("email", "password");

export const joiPaginationSchema = joi.object().keys({
  page: joi.number().min(1).max(3000),
  limit: joi.number().min(5).max(1000),
});

export const joiUserIdSchema = joi.object().keys({
  id: joi.objectId().required(),
});

export const yupUpdateRoleSchema = yup.object().shape({
  role: yup.string().oneOf(["Admin", "Developer", "Helper"]).required(),
});

export const joiUpdateUserSchema = joi.object().keys({
  name: joi.string().min(3).max(60),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .trim()
    .lowercase(),
  role: joi.string().valid("Admin", "Developer", "Helper"),
  old_password:  joi.string().min(6).max(60),
  new_password: joi.string().min(6).max(60),
  confirm_new_password: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .valid(joi.ref("password")),
}).with('new_password', 'confirm_new_password');
