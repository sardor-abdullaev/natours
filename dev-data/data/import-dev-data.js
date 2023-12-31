const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
require("dotenv").config();

const Tour = require("./../../models/tour.model");
const Review = require("./../../models/review.model");
const User = require("./../../models/user.model");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful!"));

//   Read JSON file
const tours = JSON.parse(fs.readFileSync(path.join(__dirname, "tours.json")));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, "users.json")));
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, "reviews.json"))
);

// import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
