import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice";

export default function Signup() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    fullname: "",
    username: "",
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
        "http://localhost:8000/api/users/register",
        user
      );

      dispatch(setAuthUser(data.user));
      Cookies.set("token", data.token, { expires: 30 });
      navigate("/");

      setUser({
        email: "",
        password: "",
        fullname: "",
        username: "",
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
      <section className="signup">
        <div>
          <div className="signup-form">
            <img
              src="/images/Instagram-Logo-2010-2013.png"
              alt=""
              className="instaname-logo"
            />

            <p>Sign up to see photos and videos from your friends.</p>

            <form onSubmit={submitHandler}>
              <div>
                <input
                  value={user.email}
                  onChange={inputHanlder}
                  type="email"
                  className="main-input"
                  name="email"
                  placeholder="Email"
                  required
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
              <div className="mt-2">
                <input
                  value={user.fullname}
                  onChange={inputHanlder}
                  type="text"
                  className="main-input"
                  name="fullname"
                  placeholder="Full Name"
                />
              </div>
              <div className="mt-2">
                <input
                  value={user.username}
                  onChange={inputHanlder}
                  type="text"
                  className="main-input"
                  name="username"
                  placeholder="Username"
                />
              </div>

              <div className="mt-3">
                <p className="tex">
                  People who use our service may have uploaded your contact
                  information to Instagram. <a href="#"> Learn More</a>
                </p>
              </div>
              <div className="mt-3">
                <p className="tex">
                  By signing up, you agree to our{" "}
                  <a href="#"> Terms,Privacy Policy </a>and{" "}
                  <a href="#">Cookies Policy.</a>
                </p>
              </div>

              <div>
                <button type="submit" className="submit-btn">
                  {isLoading ? <span className="loader"></span> : "Sign up"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 msg py-4">
            <p className="mb-0">
              Have an account?{" "}
              <Link to="/login" className="page">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
