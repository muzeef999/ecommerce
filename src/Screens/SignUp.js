import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { OtpForm } from "./OtpForm";

export default function SignUp() {
  const [otpForm, showForm] = useState(true);

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://13.50.236.236/api/register-user/",
        {
          name,
          email,
          phone,
          gender,
          dob,
        }
      );
      console.log(data);
      showForm(false);
      console.log(data.data[0].uid);
      sessionStorage.setItem("userID", data.data[0].uid);
      //ctxDispatch({type:'USER_SIGNIN', payload: data})
      //localStorage.setItem('userInfo', JSON.stringify(data));
      // navigate(redirect || '/');
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      {otpForm ? (
        <div>
          <h1 className="my-3">Sign In</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>gender</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => setGender(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                required
                onChange={(e) => setDob(e.target.value)}
              />
            </Form.Group>

            <div className="mb-3">
              <Button type="submit">Sign In</Button>
            </div>

            <div className="mb-3">
              Already have an account?{" "}
              <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
            </div>
          </Form>
        </div>
      ) : (
        <>
          <OtpForm />
        </>
      )}
    </Container>
  );
}
