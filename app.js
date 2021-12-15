require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("./config/db.config")();

const API_VERSION = 1;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(cors({ origin: process.env.REACT_APP_URL }));

const userRouter = require("./routes/user.routes");
const animalRouter = require("./routes/animal.routes");
const medicalAppointmentRouter = require("./routes/medicalAppointment.routes");
const vetRouter = require("./routes/vet.routes");
const medicalRecordRouter = require("./routes/medicalRecord.routes");
const resetPasswordRouter = require("./routes/resetPassword.routes")
const appointmentRouter = require("./routes/appointment.routes")

app.use(`/api/v${API_VERSION}/user`, userRouter);
app.use(`/api/v${API_VERSION}/animal`, animalRouter);
app.use(`/api/v${API_VERSION}/medical-appointment`, medicalAppointmentRouter);
app.use(`/api/v${API_VERSION}/vet`, vetRouter);
app.use(`/api/v${API_VERSION}/medical-record`, medicalRecordRouter);
app.use(`/api/v${API_VERSION}/password`, resetPasswordRouter);
app.use(`/api/v${API_VERSION}/appointment`, appointmentRouter);


app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);
