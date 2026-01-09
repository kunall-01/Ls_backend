const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/instructors", require("./routes/instructorRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
