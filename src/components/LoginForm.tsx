import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { AppDispatch } from "../store";
import { User } from "../types";
import styled from "styled-components";
import FullscreenLoading from "./FullscreenLoading";
import { login } from "../actions/userActions";

const Container = styled.div`
  width: 400px;
  height: auto;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  padding: 20px;
  font-size: 16px;

  h1 {
    font-weight: 500;
    font-size: 24px;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;

    input[type="text"], input[type="password"] {
      margin: 10px 0;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ccc;
      outline: none;
      font-size: 14px;
    }
  }
`;

const Checkbox = styled.label`
  display: inline-block;
`;

const Remember = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  a {
    color: #2673dd;
  }
`;

const Login = styled.button`
  margin-top: 20px;
  padding: 15px 0;
  border-radius: 4px;
  outline: none;
  border: none;
  background-color: #2673dd;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
`;

const CreateAccount = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    margin-right: 5px;
  }

  a {
    color: #2673dd;
  }
`;

const ErrorSpan = styled.span`
  font-size: 14px;
  color: #ff4742;
`;

const Alert = styled.div`
  background-color: #ffe9e8;
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid #ff736f;
  color: #ff424f;
  font-size: 14px;
`;


interface LoginValues {
  username: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Không được để trống"),
  password: Yup.string().required("Không được để trống"),
});

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userLogin = useSelector((state: any) => state.userLogin);
  const { error, userInfo }: { error: Error; userInfo: User } = userLogin;

  useEffect(() => {
    if (userInfo) window.location.href = window.location.origin;
  }, [userInfo]);

  return (
    <Container>
      {userInfo && <FullscreenLoading />}
      <h1>Đăng nhập</h1>
      {error && <Alert>{error}</Alert>}
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values: LoginValues) => {
          dispatch(login(values.username, values.password));
        }}
        validationSchema={LoginSchema}
      >
        {({ errors }) => (
          <Form autoComplete="off">
            <Field type="text" name="username" placeholder="Tên đăng nhập" />
            {errors.username && <ErrorSpan>{errors.username}</ErrorSpan>}
            <Field type="password" name="password" placeholder="Mật khẩu" />
            {errors.password && <ErrorSpan>{errors.password}</ErrorSpan>}
            <Remember>
              <Checkbox>
                <Field type="checkbox" name="remember" />
                <span>Nhớ tôi</span>
              </Checkbox>
              <Link to={"/account/reset"}>Quên mật khẩu?</Link>
            </Remember>
            <Login type="submit">Đăng nhập</Login>
            <CreateAccount>
              <p>Chưa có tài khoản?</p>
              <Link to={"/account/register"}>Tạo tài khoản</Link>
            </CreateAccount>
          </Form>
        )}
      </Formik>
    </Container>
  );
};
