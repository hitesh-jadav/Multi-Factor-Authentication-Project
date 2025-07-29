import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportconfig.js"

dotenv.config();
dbConnect();

const app = express();

const corsopt = {
  origin: ["http://localhost:3001"],
  credential: true,
};
app.use(cors(corsopt));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(session({
  secret: process.env.SECRET_KEY || "SECRET_KEY",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 6000 * 60,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}.`);
});
