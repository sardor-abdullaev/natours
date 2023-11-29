const express = require("express");
const reviewController = require("../controllers/review.controller");
const authController = require("../controllers/auth.controller");

// there is no access to tourId by default
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
