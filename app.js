const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");

const { dbConnect } = require("./configs/dbConnect");
const { errorHandlerMiddleware } = require("./middlewares/errorHandler");
const { notFound } = require("./middlewares/notFound");

const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const orderRouter = require("./routes/order.routes");
const userRouter = require("./routes/user.routes");

require("dotenv").config();

const port = process.env.PORT;

app.use(cookieParser(process.env.SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(notFound);
// app.use(errorHandlerMiddleware);
app.use(fileUpload());
app.use(mongoSanitize());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

const runServer = (port) => {
  dbConnect()
    .then((res) => {
      app.listen(port);
      console.log(`App is listening on PORT ${port}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
runServer(port);
