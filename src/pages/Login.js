import axios from "../api/backend";
import { useForm } from "react-hook-form";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/auth";
import {useContext, useEffect} from "react";
import {flushSync} from "react-dom";

const telegram_bot_id = process.env.REACT_APP_TG_BOT_ID


export default function Login(){
    const { register, handleSubmit, setError, formState: { errors } } = useForm({mode: "onBlur"});
    const navigate = useNavigate();
    const { setUserInfo } = useContext(AuthContext);

    const onSubmit = async (data) => {
        let dataForm = new FormData();
        dataForm.append('username', data['username']);
        dataForm.append('password', data['password']);
        await axios.post('/auth/token', dataForm)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('roles', response.data.roles)
                    localStorage.setItem('user_guid', response.data.guid)
                    flushSync(() => {
                        setUserInfo({
                            username: response.data.username,
                            roles: response.data.roles,
                            user_guid: response.data.guid
                        })
                    });
                    navigate('/profile');
                }
            }).catch((error)=>{
                    if (error.message === "Network Error"){
                        setError("password", {type: "custom", message: "Server is not available"})
                    }
                    else {
                        if (error.response.status === 401) {
                            setError("password", {type: "focus", message: error.response.data.detail})
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
        <div>
            <h3>Login</h3>
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-field">
                    <div>Username</div>
                    <input
                        id="username"
                        className="login-input"
                        {...register("username", {
                            required: "This field is required"
                        })}
                    />
                    {errors.username && <div className="input-warning">{errors.username.message}</div>}
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
                    <button type="submit">Login</button>
                </div>
            </form>
            <div className="login-choose-container">
                <TelegramLogin/>
                <div><Link to={`/forgot_password`}>Forgot password?</Link></div>
                <div><Link to={`/signup`}>Sign Up</Link></div>
            </div>
        </div>
    )
}


function TelegramLogin(){
    const navigate = useNavigate();
    const { setUserInfo } = useContext(AuthContext);

    const dataOnauth = (userData) => {
        axios.post('/auth/tg/login', userData)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    localStorage.setItem('user_guid', response.data.guid);
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('roles', response.data.roles);
                    flushSync(() => {
                        setUserInfo({
                            user_guid: response.data.guid,
                            username: response.data.username,
                            roles: response.data.roles
                        })
                    });
                    navigate('/profile');
                }
            }).catch((error)=> {
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
        script.setAttribute('data-size',  "medium");
        script.setAttribute('data-request-access', "write");
        script.setAttribute(
            "data-onauth",
            "TelegramLoginWidget.dataOnauth(user)"
        )

        el.appendChild(script)
        return () =>{
            el.removeChild(script)
        }
    }, []);

    return (
        <div id="telegram-login">
        </div>
    )
}