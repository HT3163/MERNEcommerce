import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";

/* Used in ConfirmOrder summary. Compact read-only version. */
const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <div className="cart-item-card">
      <img src={item.image} alt={item.name} className="cart-item-card-img" />
      <div className="cart-item-card-info">
        <Link to={`/product/${item.product}`} className="cart-item-card-name">
          {item.name}
        </Link>
        <span className="cart-item-card-price">${item.price?.toLocaleString()}</span>
        {deleteCartItems && (
          <button
            className="cart-item-card-remove"
            onClick={() => deleteCartItems(item.product)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItemCard;
