import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Col, Modal, Row } from "react-bootstrap";
import { OtpForm } from "./OtpForm";

export default function SigninScreen() {
  const phoneRef = useRef();

  const [otpForm, showForm] = useState(true);

  const [number, setNumber] = useState("");

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (number.length == 0) {
        toast.error("please fill Mobile Number");
      } else if (number.length < 10) {
        toast.error("Enter valid phone number");
      } else {
        let url = "http://13.50.248.3/api/login/";

        let options = {
          method: "POST",
          url: url,
          data: { phone: number },
        };

        let response = await axios(options);

        const passuid = response.data.data[0].uid;
        sessionStorage.setItem("userID", passuid);
        console.log(passuid);

        let record = response.data;

        if (record.status == "200") {
          toast.success(record.message);

          showForm(false);
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (err) {
      toast.error(getError(err.message));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div>
      <Container>
        <Helmet>
          <title>Sign In</title>
        </Helmet>

        {otpForm ? (
          <div>
            <Container>
              <Row>
                <Col
                  md={6}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div>
                    <h1 className="my-3">Sign In</h1>

                    <Form onSubmit={submitHandler}>
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="number"
                          onChange={(e) => setNumber(e.target.value)}
                          width={"100%"}
                          placeholder="Phone Number"
                        />
                      </Form.Group>

                      <div className="mb-3">
                        <Button type="submit">Sign OTP</Button>
                      </div>

                      <div className="mb-3">
                        New customer?{" "}
                        <Link to={`/signup?redirect=${redirect}`}>
                          Create your account
                        </Link>
                      </div>
                    </Form>
                  </div>
                </Col>
                <Col md={6}>
                  <img
                    src={require("../asserts/login.jpg")}
                    alt="SignIn"
                    width={"100%"}
                  />
                </Col>
              </Row>
            </Container>
          </div>
        ) : (
          <>
            <OtpForm />
          </>
        )}
      </Container>
    </div>
  );
}
