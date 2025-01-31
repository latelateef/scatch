const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { generateToken } = require("../utils/generateToken");
router.use(cookieParser());

module.exports.registerUser = async function (req, res) {
  try {
    const { fullName, email, password } = req.body;
    let user = await userModel.find({ email });
    if (user.length > 0) {
      req.flash("error", "User already exists! Please login");
      return res.redirect("/");
    }
    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        req.flash("error", "Internal Server Error");
        return res.redirect("/");
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          req.flash("error", "Internal Server Error");
          return res.redirect("/");
        }
        let createdUser = await userModel.create({
          fullName,
          email,
          password: hash,
        });
        const token = generateToken(createdUser);
        res.cookie("token", token);
        res.redirect("/shop");
      });
    });
    // res.redirect("/shop");
  } catch (error) {
    req.flash("error", "Internal Server Error");
    return res.redirect("/");
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user.length === 0) {
      req.flash("error", "Invalid Credentials");
      return res.redirect("/");
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        req.flash("error", "Internal Server Error");
        return res.redirect("/");
      }
      if (result) {
        const token = generateToken(user);
        res.cookie("token", token);
        return res.redirect("/shop");
      }
      req.flash("error", "Invalid Credentials");
      return res.redirect("/");
    });
  } catch (error) {
    req.flash("error", "Internal Server Error");
    return res.redirect("/");
  }
};

module.exports.registerOwner = async (req, res) => {
  try {
    let owners = await ownerModel.find();
    if (owners.length > 0) {
      return res.status(500).send("Owner already exists");
    }
    const { fullName, email, password } = req.body;
    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).send("Internal Server Error");
        }
        let createdOwner = await ownerModel.create({
          fullName,
          email,
          password: hash,
        });
        res.status(201).send(createdOwner);
      });
    });
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.redirect("/");
  }
};

module.exports.loginOwner = async function (req, res) {
  try {
    const { email, password } = req.body;
    const owner = await owner.findOne({ email });
    if (!owner) {
      req.flash("error", "Invalid Credentials");
      return res.redirect("/owners/login");
    }
    bcrypt.compare(password, owner.password, (err, result) => {
      if (err) {
        req.flash("error", "Internal Server Error");
        return res.redirect("/owners/login");
      }
      if (result) {
        const token = jwt.sign({ owner }, process.env.JWT_KEY);
        res.cookie("token", token);
        res.redirect("/owners/admin");
      } else {
        req.flash("error", "Invalid Credentials");
        res.redirect("/owners/login");
      }
    });
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.redirect("/owners/login");
  }
};

module.exports.logout = async function (req, res) {
  res.clearCookie("token");
  return res.redirect("/");
};
