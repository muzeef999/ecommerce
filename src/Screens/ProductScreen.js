import axios from 'axios';
import React, {useContext, useEffect, useReducer, useRef, useState} from 'react'
import { Badge, Button, Card, Col, Container, FloatingLabel, ListGroup, Row } from 'react-bootstrap';
import {Form, Link, useNavigate, useParams } from 'react-router-dom'
import Rating from '../Compoents/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Compoents/LoadingBox';
import MessageBox from '../Compoents/MessageBox';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';



const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
        return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
          return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
          return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};



const ProductScreen = () => {

  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');


  const navigate = useNavigate();
  const params = useParams();
  const {id} = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
  useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`http://13.50.236.236/api/all-products/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [id]);
  
  const {state, dispatch:ctxDispatch} = useContext(Store);

  const { cart, userInfo } = state;

  const addToCartHandler = async() => {
            const existItem = cart.cartItems.find((x) => x.id === product.id);
            const quantity = existItem ? existItem.quantity + 1 : 1;
            const {data} = await axios.get(`http://13.50.236.236/api/all-products/${id}`);
            if(data.no_of_products < quantity) {
              window.alert('Sorry. product is out stock');
              return;
            }
           ctxDispatch({type:'CART_ADD_ITEM', 
           payload: {...product, quantity},})
           navigate('/cart');
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `http://13.50.236.236/products/${product.id}/reviews`,
        { rating, comment, name: userInfo[0].name },
        {
          headers: { Authorization: `Bearer ${userInfo[0].uid}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  return (
    loading? <LoadingBox/>
    : error ?  <MessageBox variant="danger">{error}</MessageBox>
    :<div>
      <Container style={{marginTop:'20px'}}>
      <Row>
        <Col md={5}>
           <img className='img-large'
            src={"http://13.50.236.236" + product.thumbnail} alt={product.product_title}
           />
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
               <h1>{product.product_title}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                 rating={product.rating}
                 numReviews={product.numReviews}>
                 </Rating>
            </ListGroup.Item>
            <ListGroup.Item>
              price : ₹{product.selling_price}
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
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
                      {
                       product.no_of_products>0?
                      <Badge bg="success">In Stock</Badge>
                      :
                      <Badge bg="danger">Danger</Badge>
                    }</Col>
                    </Row>
                  </ListGroup.Item>

                  {
                    product.no_of_products > 0 && (
                      <ListGroup.Item>
                        <div className='d-grid'>
                          <Button onClick={addToCartHandler} variant='primary'>
                            Add to Cart
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )
                  }
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      </Container>
      <Helmet>
      <title>{product.product_title}</title>
      </Helmet>
    </div>
  )
}

export default ProductScreen
