const asyncMiddleware = require("../middleware/async");
const express = require("express");
const router = express.Router();
const { Course, validateCourse } = require("../models/courses");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const courses = await Cours.find();
    res.send(courses);
  })
);

router.post("/", async (req, res) => {
  const { name, category, author, tags, isPublished, price } = req.body;

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let course = new Course({
    name,
    category,
    author,
    tags,
    isPublished,
    price,
  });

  // Handle errors
  try {
    course = await course.save();
    res.send(course);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
});

router.put("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

router.delete("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");
  res.send(course);
});

module.exports = router;
