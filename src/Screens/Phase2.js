import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getError } from "../utils";
import { useParams } from "react-router-dom";
import Product from "../Compoents/Product";
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

const Phase2 = () => {
  const params = useParams();
  const { id } = params;

  const [subCategories, setsubCategories] = useState([]);

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  console.log(products.map((course) => course.sub_category.sub_category));

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("http://13.50.248.3/api/all-products/");

        dispatch({ type: "FETCH_SUCCESS", payload: result.data.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
    const subCategories = async () => {
      try {
        const subcat = await axios.get(
          `http://13.50.248.3/super-admin/particular-category-sub-category-list/${id}/`
        );
        setsubCategories(subcat.data.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    subCategories();
  }, []);

  return (
    <>
      <Row style={{ marginTop: "50px" }}>
        <Col md={3} className="d-flex justify-content-center">
          <div>
            {subCategories.map((product) => (
              <div key={product.id}>
                <p style={{ fontSize: "20px" }}>{product.sub_category}</p>
              </div>
            ))}
          </div>
        </Col>
        <Col md={9}>
          <Row>
            {products.map((product) => (
              <Col sm={6} lg={4} className="mb-3" key={product.id}>
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Phase2;
