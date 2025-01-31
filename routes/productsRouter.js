const express = require('express');
const router = express.Router();

const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.get("/", (req, res) => {
    res.send("Products Route");
});

router.post("/create", upload.single("image"), async function (req, res) {
    try {
        const {name, price, discount, bgColor, panelColor, textColor} = req.body;
        const image = req.file.buffer;
        let product = await productModel.create({
            name,
            price,
            discount,
            bgColor,
            panelColor,
            textColor,
            image
        });
        console.log(bgColor);
        console.log(typeof bgColor);
        console.log(product);
        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");
    } catch (error) {
        req.flash("error", "Internal Server Error");
        res.redirect("/owners/admin");
    }
});

module.exports = router;