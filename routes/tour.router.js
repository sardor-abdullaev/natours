const express = require("express");
const tourController = require("./../controllers/tour.controller");
const authController = require("../controllers/auth.controller");
// const reviewController = require("../controllers/review.controller");
const reviewRouter = require("./review.router");

const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/2dkj324fjsd/reviews
// GET /tour/2dkj324fjsd/reviews
// GET /tour/2dkj324fjsd/reviews/f387jfgvbdfj
// router
//   .route("/:tourId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

router.use("/:tourId/reviews",reviewRouter)

router
  .route("/top-5-cheap")
  .get(tourController.aliesTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
