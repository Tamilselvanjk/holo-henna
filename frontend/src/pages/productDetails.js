import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

export default function ProductDetails({ cartItems, setCartItems }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(process.env.REACT_APP_API_URL + '/products/' + id);
                const data = await response.json();

                if (data.success) {
                    setProduct(data.product);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    function addToCard() {
        const itemExits = cartItems.find(item => item.product._id == product._id);
        if (!itemExits) {
            const newItems = { product, qty };
            setCartItems((state) => [...state, newItems]);
            toast.success(" Cart item added successfully! ")
        }
    }
    // increase quantity
    function increaseQty() {
        if (product.stock == qty) {
            return;
        }
        setQty(state => state + 1)
    }

    // decrease Quantity
    function decreaseQty() {
        if (qty > 1) {
            setQty(state => state - 1)

        }
    }

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!product) return <div className="alert alert-info">No product found</div>;

    return product && <div className="row f-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
            <img src={product.images[0].image} alt="sdf" height="500" width="500" />
        </div>

        <div className="col-12 col-lg-5 mt-5">
            <h3>{product.name}</h3>
            <p id="product_id">Product #{product._id}</p>

            <hr />

            <div className="rating-outer">
                <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
            </div>


            <hr />

            <p id="product_price">${product.price}</p>
            <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                <input type="number" className="form-control count d-inline" value={qty} readOnly />

                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
            </div>
            <button type="button" onClick={addToCard} disabled={product.stock == 0} id="cart_btn" className="btn btn-primary d-inline ml-4">Add to Cart</button>

            <hr />

            <p>Status: <span id="stock_status" className={product.stock > 0 ? 'text-success' : 'text-danger'}>{product.stock > 0 ? 'In Stock' : 'Out of  stock'}</span></p>

            <hr />

            <h4 className="mt-2">Description:</h4>
            <p>{product.description}</p>
            <hr />
            <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

            <div className="rating w-50"></div>

        </div>

    </div>
}