import React, { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { Store } from "../Store";
import axios from "axios";

const Product = (props) => {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(
      `http://13.50.248.3/api/all-products/${item.id}`
    );
    if (data.no_of_products < quantity) {
      window.alert("Soory. product is out stock");
      return;
    }
    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  return (
    <Card key={product.id} className="product">
      <Link to={`/product/${product.id}`}>
        <img
          key={product.id}
          className="card-img-top"
          style={{
            width: "300px",
            height: "400px",
            objectFit: "contain",
            alignItems: "center",
          }}
          src={"http://13.50.248.3" + product.thumbnail}
          alt={product.product_title}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <Card.Title style={{ color: "#000" }}>
            {product.product_title}
          </Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>₹{product.actual_price}</Card.Text>
        {product.no_of_products === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(product)}
            className=".btn-primary1"
          >
            Add To Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
