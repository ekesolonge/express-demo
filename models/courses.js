const mongoose = require("mongoose");
const Joi = require("joi");

// Model definition - Create a new table named courses
const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      // match: /pattern/,
    },
    category: {
      type: String,
      enum: ["web", "mobile", "network"],
      required: true,
      lowercase: true,
      // uppercase: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      validate: {
        validator: function (v) {
          return new Promise((resolve, reject) => {
            resolve(v && v.length > 0);
          });
        },
        message: "A course should have at least one tag",
      },
    },
    date: { type: Date, default: Date.now },
    isPublished: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: function () {
        return this.isPublished;
      },
      min: 10,
      max: 200,
      get: (v) => Math.round(v), // rounds value of price when getting
      set: (v) => Math.round(v), // rounds value of price inputted
    },
  })
);

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
    category: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    tags: Joi.array(),
    isPublished: Joi.bool(),
    price: Joi.number(),
  };

  return Joi.validate(course, schema);
}

exports.Course = Course;
exports.validateCourse = validateCourse;
