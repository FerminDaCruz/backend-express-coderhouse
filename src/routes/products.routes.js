import Product from "../models/product.model.js";
import router from "./carts.routes.js";

router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, category, avalaible, sort } = req.query;
        const query = {};
        if (category) query.category = category;
        if (avalaible !== undefined) query.available = available === "true";

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort:
                sort === "asc"
                    ? { price: 1 }
                    : sort === "desc"
                    ? { price: -1 }
                    : {},
        };

        const result = await Product.paginate(query, options);
        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/products?page=${result.prevPage}&limit=${limit}${
                      category ? `&category=${category}` : ""
                  }${available ? `&available=${available}` : ""}${
                      sort ? `&sort=${sort}` : ""
                  }`
                : null,
            nextLink: result.hasNextPage
                ? `/products?page=${result.nextPage}&limit=${limit}${
                      category ? `&category=${category}` : ""
                  }${available ? `&available=${available}` : ""}${
                      sort ? `&sort=${sort}` : ""
                  }`
                : null,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
        res.status(500).json({
            error: "Error al guardar el producto",
            message: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        console.log(req.params);
        const product = await Product.findById(req.params.id);
        if (!product)
            return res
                .status(404)
                .json({ status: "error", message: "Producto no encontrado" });
        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct)
            return res
                .status(404)
                .json({ status: "error", message: "Producto no encontrado" });
        res.json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct)
            return res
                .status(404)
                .json({ status: "error", message: "Producto no encontrado" });
        res.json({
            status: "success",
            message: "Producto eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default router;
