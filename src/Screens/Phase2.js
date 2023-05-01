import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { getError } from "../utils";

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

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(
          `http://13.50.236.236/super-admin/particular-category-sub-category-list/${id}/`
        );

        dispatch({ type: "FETCH_SUCCESS", payload: result.data.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <Link to={`subcategory/${product.id}`}>
            <Container>
              <img
                src={"http://13.50.236.236" + product.sub_category_img}
                width={"100%"}
                style={{ padding: "10px" }}
              />
            </Container>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Phase2;
