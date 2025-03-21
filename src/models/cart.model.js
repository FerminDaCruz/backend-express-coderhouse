import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema(
    {
        productos: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
    },
    { timestamps: true }
);

const Cart = mongoose.model(cartCollection, cartSchema);
export default Cart;
