const express = require('express');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const router = express.Router();

const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const { logout } = require('../controllers/authControllers');

router.get("/", (req, res) => {
    let error = req.flash("error");
    const loggedIn = false;
    res.render("index", {error, loggedIn});
});

router.get("/shop", isLoggedIn, async (req, res) => {
    try {
        let products = await productModel.find();
        // console.log(products);
        res.render("shop", {products});
    } catch (error) {
        req.flash("error", "Internal Server Error");
        res.redirect("/");
    }
});

router.get("/logout", logout);

router.get("/add-to-cart/:productId", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({email: req.user.email});
        const productId = req.params.productId;
        let cart = user.cart;
        if(!cart){
            cart = [];
        }
        cart.push(productId);
        user.save();
        res.redirect("/shop");
    } catch (error) {
        res.status(500).send("Internal Server Error");
        res.redirect("/shop");
    }
});

module.exports = router;