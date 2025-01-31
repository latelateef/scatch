const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const productModel = require('../models/product-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginOwner, registerOwner } = require('../controllers/authControllers');
require("dotenv").config();

router.get("/", (req, res) => {
    res.send("Owners Route");
});

if(process.env.NODE_ENV === "development"){
    router.post("/create-owner", registerOwner);
}

router.get("/login", (req, res) => {
    const admin = true;
    const error = req.flash("error");
    res.render("owner-login", {error, admin});
});

router.post("/login", loginOwner);

router.get("/admin", async (req, res) => {
    try {
        const success = req.flash("success");
        const products = await productModel.find();
        res.render("admin", {success, products});
    } catch (error) {
        req.flash("error", "Internal Server Error");
        res.redirect("/");
    }
});

router.get("/create-products", async (req, res) => {
    const error = req.flash("error");
    res.render("createproducts", {error});
});

router.get("/delete-all-products", async (req, res) => {
    try {
        await productModel.deleteMany();
        req.flash("success", "All products deleted successfully");
        res.redirect("/owners/admin");
    } catch (error) {
        req.flash("error", "Internal Server Error");
        res.redirect("/owners/admin");
    }
});

module.exports = router;