const Tour = require("../models/tour.model");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
// const AppError = require("../utils/appError");

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.aliesTopTours = (req, res, next) => {
  req.query.sort = "-ratingsAverage,price";
  req.query.limit = 5;
  req.query.fields = "name,duration,ratingsAverage,price";
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // console.log(APIFeatures);
//   // Execute query
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;

//   // Send response
//   res.status(200).json({
//     status: "success",
//     // requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // const tour = await Tour.findById(req.params.id).populate("guides");
//   const tour = await Tour.findById(req.params.id).populate("reviews");
//   //Tour.findOne({_id:req.params.id})

//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   // const newTour = new Tour({});
//   // newTour.save();

//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
// });
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });
