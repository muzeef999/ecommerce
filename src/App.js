import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import HomeScreen from "./Screens/HomeScreen";
import ProductScreen from "./Screens/ProductScreen";
import { Badge, Button, Container, NavDropdown, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import { Store } from "./Store";
import { useContext, useEffect, useState } from "react";
import CartScreen from "./Screens/CartScreen";
import SearchBox from "./Compoents/SearchBox";
import SigninScreen from "./Screens/SigninScreen";
import ShippingAddressScreen from "./Screens/ShippingAddressScreen";
import { getError } from "./utils";
import axios from "axios";
import SearchScreen from "./Screens/SearchScreen";
import Phase2 from "./Screens/Phase2";
import SignUp from "./Screens/SignUp";
import { Subproducts } from "./Screens/Subproducts";
import PaymentMethodScreen from "./Screens/PaymentMethodScreen";
import PlaceOrderScreen from "./Screens/PlaceOrderScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://13.50.248.3/super-admin/all-category/"
        );
        setCategories(data.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };

  const [sidebarIsOpen, setSiderIsOpen] = useState(false);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <Navbar variant="dark" style={{ backgroundColor: "#2874f0" }}>
          <Container>
            <Button
              style={{ backgroundColor: "#2874f0" }}
              onClick={() => setSiderIsOpen(!sidebarIsOpen)}
            >
              <i className="fas fa-bars"></i>
            </Button>
            <LinkContainer to="/">
              <Navbar.Brand>
                <b style={{ fontWeight: "800" }}>&nbsp;CODE CONNEX</b>
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto w-100  justify-content-end">
                <SearchBox />
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/cart" className="nav-link">
                  Cart{" "}
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown
                    title={userInfo.data[0].name}
                    id="basic-nav-dropdown"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
                <Link className="nav-link" to="#">
                  Contact Us
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category.id}>
                <Link
                  to={`/search?category=${category}`}
                  onClick={() => setSiderIsOpen(false)}
                >
                  <Nav.Link style={{ color: "#FFF" }}>
                    {category.category}
                  </Nav.Link>
                </Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/cat/:id" element={<Phase2 />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cat/:id/subcategory/:id" element={<Subproducts />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
          </Routes>
        </main>

        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
