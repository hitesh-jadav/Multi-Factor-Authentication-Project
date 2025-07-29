import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jsonwebtoken from "jsonwebtoken";


export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashpassword,
      isMfaActive: false,

    });

    console.log("new User :", newUser);

    await newUser.save();
    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering use", message: error });
  }
};

export const login = async (req, res) => {
  console.log("the authenticated user is:", req.user);
  res.status(200).json({ message: "User logged in successfully", username: req.user.username, isMfaActive: req.user.isMfaActive });
};

export const authstatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "User logged in successfully", username: req.user.username, isMfaActive: req.user.isMfaActive });
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};

export const logout = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user" });
  } else {
    req.logout((err) => {
      if (err) {
        res.status(400).json({ message: "User not logged in" });
      } else {
        res.status(200).json({ message: "Logout successfully" });
      }
    });
  }
};

export const setup2FA = async (req, res) => {
  try {
    const user = req.user;
    var secret = speakeasy.generateSecret();  
    user.twofactoresecret = secret.base32;
    user.isMfaActive = true;
    await user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "hitesh jadav",
      encoding: "base32",
    });
    const qr_image_url = await qrcode.toDataURL(url);

    res.json({
      secret: secret.base32,
      qrcode: qr_image_url,
    });

  } catch (err) {
    res.status(500).json({ error: "Error setting 2FA", message: err.message });
  }
};

export const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twofactoresecret,
    encoding: "base32",
    token,
  });

  if (verified) {
    const jwttoken = jsonwebtoken.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1hr" });

    res.status(200).json({ message: "2FA successfully", token: jwttoken });
  } else {
    res.status(400).json({ message: "invalide 2FA token" });
  }
};

export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twofactoresecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successfully" });

  } catch (err) {
    res.status(500).json({ message: "error reseting 2FA", message: err });
  }
};