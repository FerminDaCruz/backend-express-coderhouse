import Product from "../models/product.model.js";
import { Router } from "express";

const router = Router();

router.get("/products", async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true,
    };
    const result = await Product.paginate({}, options);
    result.prevLink = result.hasPrevPage
        ? `/products?page=${result.prevPage}`
        : null;
    result.nextLink = result.hasNextPage
        ? `/products?page=${result.nextPage}`
        : null;

    res.render("products", result);
});

router.get("/products/:pid", async (req, res) => {
    const product = await Product.findById(req.params.pid).lean();
    res.render("productDetail", { product });
});

router.get("/carts/:cid", async (req, res) => {
    const cart = await Cart.findById(req.params.cid)
        .populate("products.product")
        .lean();
    res.render("cart", { cart });
});

export default router;
