import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product, onAddToCart }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { name, price, imageUrl, description, pid } = product;
  const keyId = pid;


  function handleAdd(e) {
    e.stopPropagation();
    e.preventDefault();

<<<<<<< HEAD

    if (!isAuthenticated()) {

=======
    if (!isAuthenticated()) {
>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    console.log("ProductCard: Add clicked", { pid: keyId, name });
    if (typeof onAddToCart === "function") {
      onAddToCart(product);
    } else {
      addToCart(product, 1);
<<<<<<< HEAD

=======
>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
      window.dispatchEvent(new CustomEvent("toggle-cart"));
    }
  }

  return (
    <article className="card" role="article">
      <div className="card-image">
        <Link to={`/product/${keyId}`} style={{ display: "block", width: "100%", height: "100%" }}>
          <img
            src={imageUrl || "/images/products/placeholder.png"}
            alt={name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/products/placeholder.png";
            }}
            style={{ display: "block", width: "100%", height: 260, objectFit: "cover" }}
          />
        </Link>
      </div>

      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/product/${keyId}`} style={{ color: "inherit", textDecoration: "none" }}>{name}</Link>
        </h3>

        <p className="card-desc">{description?.slice(0, 120)}</p>

        <div className="card-footer">
          <strong className="price">Rs {Number(price || 0).toLocaleString()}</strong>
          <button type="button" className="btn" onClick={handleAdd}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}



