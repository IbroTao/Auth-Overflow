const express = require("express");
const { dbConnect } = require("./configs/dbConnect");
const app = express();
require("dotenv").config();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
