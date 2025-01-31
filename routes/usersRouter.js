const express = require('express');
const router = express.Router();

// const productModel = require('../models/product-model');
const { registerUser, loginUser } = require("../controllers/authControllers");
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');
const productModel = require('../models/product-model');

router.get("/", (req, res) => {
    res.redirect("/");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/cart", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({email: req.user.email}).populate("cart");
        let products = user.cart;
        res.render("cart", {products});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;