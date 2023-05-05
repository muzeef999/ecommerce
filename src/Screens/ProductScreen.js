import axios from "axios";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../Compoents/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Compoents/LoadingBox";
import MessageBox from "../Compoents/MessageBox";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(
          `http://13.50.248.3/api/all-products/${id}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, [id]);

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://13.50.248.3/api/all-products/${id}`
    );
    if (data.no_of_products < quantity) {
      window.alert("Sorry. product is out stock");
      return;
    }
    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `http://13.50.248.3/api/post-review/`,
        {
          user: userInfo.data[0].uid,
          product: id,
          subject: comment,
          description: "manual data",
          ratings: rating,
          name: userInfo.data[0].name,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access}` },
        }
      );
      dispatch({
        type: "CREATE_SUCCESS",
      });
      console.log(data);
      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Container style={{ marginTop: "20px" }}>
        <Row>
          <Col md={5}>
            <img
              className="img-large"
              src={"http://13.50.248.3" + product.thumbnail}
              alt={product.product_title}
            />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h1>{product.product_title}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                ></Rating>
              </ListGroup.Item>
              <ListGroup.Item>price : ₹{product.selling_price}</ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Pirce</Col>
                      <Col>₹{product.selling_price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status : </Col>
                      <Col>
                        {product.no_of_products > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Danger</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.no_of_products > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary">
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="my-3">
          <h2 ref={reviewsRef}>Reviews</h2>
          <div className="mb-3">
            {product.product_reviews.length === 0 && (
              <MessageBox>There is no review</MessageBox>
            )}
          </div>
          <ListGroup>
            {product.product_reviews.map((review) => (
              <ListGroup.Item key={review.id}>
                <strong>{review.user.name}</strong>
                <Rating rating={review.ratings} caption=" "></Rating>
                <p>Post Date:{review.created_date}</p>
                <p>{review.subject}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="my-3">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <h2>Write a customer review</h2>
                <Form.Group className="mb-3" controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    aria-label="Rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1">1- Poor</option>
                    <option value="2">2- Fair</option>
                    <option value="3">3- Good</option>
                    <option value="4">4- Very good</option>
                    <option value="5">5- Excelent</option>
                  </Form.Select>
                </Form.Group>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Comments"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </FloatingLabel>

                <div className="mb-3">
                  <Button disabled={loadingCreateReview} type="submit">
                    Submit
                  </Button>
                  {loadingCreateReview && <LoadingBox></LoadingBox>}
                </div>
              </form>
            ) : (
              <MessageBox>
                Please{" "}
                <Link to={`/signin?redirect=/product/${product.id}`}>
                  Sign In
                </Link>{" "}
                to write a review
              </MessageBox>
            )}
          </div>
        </div>
      </Container>
      <Helmet>
        <title>{product.product_title}</title>
      </Helmet>
    </div>
  );
};

export default ProductScreen;
