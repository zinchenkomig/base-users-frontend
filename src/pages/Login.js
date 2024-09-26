import axios from "../api/backend";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/auth";
import { useContext, useEffect } from "react";
import { flushSync } from "react-dom";
import { getAccessTokenInfo } from "../features/auth"

const telegram_bot_id = process.env.REACT_APP_TG_BOT_ID


export default function Login() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ mode: "onBlur" });
  const navigate = useNavigate();
  const { setUserInfo } = useContext(AuthContext);

  const onSubmit = async (data) => {
    let dataForm = new FormData();
    dataForm.append('username', data['email']);
    dataForm.append('password', data['password']);
    await axios.post('/auth/login/email', dataForm)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('access_token', response.data.access_token);
          const userInfo = getAccessTokenInfo(response.data.access_token)
          flushSync(() => {
            setUserInfo(userInfo)
          });
          navigate('/profile');
        }
      }).catch((error) => {
        if (error.message === "Network Error") {
          setError("password", { type: "custom", message: "Server is not available" })
        }
        else {
          if (error.response.status === 400) {
            setError("password", { type: "focus", message: error.response.data.detail })
          }
          if (error.response.status === 500) {
            setError("password", {
              type: "custom", message: "Server is not responding. " +
                "Try again later"
            })
          }
        }
      }
      );
  }
  return (
    <div className="login-content mt-10">
      <div className="login-frame">
        <div className="text-2xl font-normal">Login</div>
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-field mt-6">
            <div>Email</div>
            <input
              id="email"
              className="login-input"
              {...register("email", {
                required: "This field is required"
              })}
            />
            {errors.email && <div className="input-warning">{errors.email.message}</div>}
          </div>
          <div className="input-field">
            <div>Password</div>
            <input
              type="password"
              className="login-input"
              {...register("password", {
                required: "This field is required"
              })}
            />
            {errors.password && <div className="input-warning">{errors.password.message}</div>}
          </div>
          <div>
            <button className="text-lg font-extrabold rounded-md" type="submit">Login</button>
          </div>
        </form>
        <div className="login-choose-container">
          <TelegramLogin />
          <Link to={`/forgot_password`} className="text-center block">Forgot password?</Link>
        </div>
        <hr className="login-hr" />

        <div className="center indent-top">
          <div>Don't have an account?</div>
          <div><Link to={`/signup`}>Sign Up</Link></div>
        </div>
      </div>
    </div>
  )
}


function TelegramLogin() {
  const navigate = useNavigate();
  const { setUserInfo } = useContext(AuthContext);

  const dataOnauth = (userData) => {
    axios.post('/auth/login/tg', userData)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('access_token', response.data.access_token);
          const userInfo = getAccessTokenInfo(response.data.access_token)
          flushSync(() => {
            setUserInfo(userInfo)
          });
          navigate('/profile');
        }
      }).catch((error) => {
        if (error.message === "Network Error") {
          alert("Server is not available")
        }
      })
  }

  useEffect(() => {
    window.TelegramLoginWidget = {
      dataOnauth: (user) => dataOnauth(user),
    };

    const script = document.createElement('script');
    const el = document.getElementById("telegram-login")

    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute('data-telegram-login', telegram_bot_id);
    script.setAttribute('data-size', "medium");
    script.setAttribute('data-request-access', "write");
    script.setAttribute(
      "data-onauth",
      "TelegramLoginWidget.dataOnauth(user)"
    )

    el.appendChild(script)
    return () => {
      el.removeChild(script)
    }
  });

  return (
    <div id="telegram-login">
    </div>
  )
}
