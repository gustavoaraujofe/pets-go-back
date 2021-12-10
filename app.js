require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("./config/db.config")();

const API_VERSION = 1

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(cors({ origin: process.env.REACT_APP_URL }));

const userRouter = require("./routes/user.routes");
const animalRouter = require('./routes/animal.routes')
const queryRouter = require('./routes/query.routes')
app.use("/api", userRouter);
app.use("/api", animalRouter);
app.use("/api", queryRouter);
const vetRouter = require("./routes/vet.routes");
const medicalRecordRouter = require("./routes/medicalRecord.routes");

app.use(`/api/v${API_VERSION}/user`, userRouter);
app.use(`/api/v${API_VERSION}/vet`, vetRouter);
app.use(`/api/v${API_VERSION}/medical-record`, medicalRecordRouter)


app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);