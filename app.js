const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/error.controller");
const tourRouter = require("./routes/tour.router");
const userRouter = require("./routes/user.router");

const app = express();

// 1) GLOBAL MIDDLEWARES
// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against xss
app.use(xss());

// prevent http parameter pollution
app.use(hpp({
  whitelist: [
    "duration",
    "maxGroupSize",
    "difficulty",
    "price",
    "ratingsAverage",
    "ratingsQuantity"
  ]
}));

// serving static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use((req, res, next) => {
  console.log("This function has been ignored!");
  next();
});

app.use(globalErrorHandler);

module.exports = app;
