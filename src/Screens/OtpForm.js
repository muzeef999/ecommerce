import React, { useContext, useRef, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import { Store } from "../Store";
import { redirect, useLocation, useNavigate } from "react-router-dom";

export const OtpForm = () => {
  const USER_ID = sessionStorage.getItem("userID");
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [otpRef, setOtpRef] = useState(" ");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://13.50.236.236/api/verify-otp/",
        {
          uid: USER_ID,
          otp: otpRef,
        }
      );

      console.log(data);
      var status = data["status"];
      if (status == 400) {
        toast.error("incorrect otp found");
      } else {
        toast.success("otp verified");
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate(redirect || "/");
      }
    } catch (err) {
      toast.error(getError(err.message));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>OTP Verification</title>
      </Helmet>
      <h1 className="my-3">Otp Verification</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>OTP</Form.Label>
          <Form.Control
            type="number"
            onChange={(e) => setOtpRef(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Sign OTP</Button>
        </div>
      </Form>
    </Container>
  );
};
