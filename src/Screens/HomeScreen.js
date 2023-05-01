import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Product from "../Compoents/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Compoents/LoadingBox";
import MessageBox from "../Compoents/MessageBox";
import { getError } from "../utils";
import Slidecarousel from "../Compoents/Slidecarousel";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  //const [products, setProducts] = useState([]);
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(
          "http://13.50.236.236/api/all-products/"
        );

        dispatch({ type: "FETCH_SUCCESS", payload: result.data.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://13.50.236.236/super-admin/all-category/"
        );
        setCategories(data.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Code Connex</title>
      </Helmet>
      <Slidecarousel />

      <Container>
        <h1 style={{ marginTop: "10px" }}>categories</h1>
        <br />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
          }}
        >
          {categories.map((category) => (
            <div key={category.id}>
              <Link
                to={`/cat/${category.id}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{ padding: "20px" }}>
                  <img
                    src={"http://13.50.236.236" + category.category_image}
                    alt={category.category}
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "8px",
                    }}
                  />
                  <p
                    style={{
                      color: "#000",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {category.category}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <h1>Today's Deals</h1>
        <div className="products">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {products.map((product) => (
                <Col sm={6} key={product.id} md={4} lg={3} className="mb-3">
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
};

export default HomeScreen;
