import { Router } from "express";
import passport from "passport";
import { login, register, authstatus, logout, setup2FA, verify2FA, reset2FA } from "../controllers/authController.js"

const router = Router();

//Register Router 

router.post("/register", register);

//Login Router 

router.post("/login", passport.authenticate("local"), login);

//auth Router

router.get("/status", authstatus);

//Logout Router

router.post("/logout", logout);

//2fa setup

router.post("/2fa/setup", (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: "unauthorized user" });
  }
}, setup2FA);

//varify Router

router.post("/2fa/verify", (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
}, verify2FA);

//Reset Router

router.post("/2fa/reset", (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
}, reset2FA);


export default router;