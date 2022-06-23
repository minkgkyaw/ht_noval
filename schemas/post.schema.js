import * as yup from "yup";
import joi from "joi";
import mongoId from "joi-objectid";

joi.objectId = mongoId(joi);

export const joiPaginationSchema = joi.object().keys({
  page: joi.number().min(0).max(3000),
  limit: joi.number().min(0).max(1000),
  sort: joi.number().min(-1).max(1)
});

export const joiCreateNewPostSchema = joi.object().keys({
  chapters: joi.number().min(1).max(4000).required(),
  body: joi.string().min(5000).max(25000).required(),
});
export const yupCreateNewPostSchema = yup.object().shape({
  chapters: yup.number().min(1, "Chapters must be at least 1").max(4000, "Chapters must be lower than 4000").required("Chapters is required"),
  body: yup.string().min(5000, "Body must be at least 5000 characters").max(25000, "Body must be lower than 25000 characters").required("Body is required")
})
export const joiPostIdSchema = joi.object().keys({
  id: joi.objectId().required(),
});

export const joiChaptersSchema = joi.object().keys({
  chapters: joi.number().min(1).max(4000).required(),
});

export const joiUpdatePostSchema = joi.object().keys({
  chapters: joi.number().min(1).max(4000),
  body: joi.string().min(5000).max(25000),
});
