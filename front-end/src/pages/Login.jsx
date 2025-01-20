import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const inputHanlder = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/login",
        user
      );

      Cookies.set("token", data.token, { expires: 30 });

      dispatch(setAuthUser(data.user));
      navigate("/");

      setUser({
        email: "",
        password: "",
      });
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.msg, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="login">
        <div className="container">
          <div className="row justify-content-center gap-3 align-items-center">
            <div className="col-12 col-lg-5 col-xl-5 image-col-parent">
              <div className="image-col">
                <img
                  src="/images/screenshot4.png"
                  alt=""
                  className="screen-shot"
                />
              </div>
            </div>

            <div className="col-12 col-lg-5 col-xl-4">
              <div className="login-form">
                <img
                  src="/images/Instagram-Logo-2010-2013.png"
                  alt=""
                  className="instaname-logo"
                />

                <form onSubmit={submitHandler}>
                  <div>
                    <input
                      value={user.email}
                      onChange={inputHanlder}
                      type="email"
                      className="main-input"
                      name="email"
                      placeholder="Email"
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      value={user.password}
                      onChange={inputHanlder}
                      type="password"
                      className="main-input"
                      name="password"
                      placeholder="Password"
                    />
                  </div>

                  <div className="mt-3">
                    <button className=" submit-btn" type="submit">
                      {isLoading ? <span className="loader"></span> : "Log in"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-4 msg">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/signup" className="page">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
