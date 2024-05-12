import axios from "../api/backend";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useState} from "react";



export default function SignUp(){
    const { register, watch, handleSubmit, setError, formState: { errors } } = useForm({mode: "onBlur"});
    const [submitError, setSubmitError] = useState(null)
    const navigate = useNavigate();

    async function validate_username(username){
        const is_exists = await axios.get('/check/username', {params: {username: username}})
            .then((response)=>{return response.data;}
            )
            .catch((reason)=>{console.log(reason)})
        return !is_exists || `Username ${username} already exists`
    }

    function onSubmit(data) {
        axios.post('/auth/register', data)
            .then(function (response) {
                if (response.status === 201) {
                    navigate('/')
                }
            })
            .catch(function (error) {
                if (error.message === "Network Error"){
                    setSubmitError("Sorry! Server is not available...");
                }
                else {
                    if (error.response.status === 409) {
                        setError("username", {type: "focus", message: "Username already exists"})
                    } else {
                        setSubmitError("User creation failed!")
                    }
                }
            });
    }

    return (
        <div>
            <h3>Sign Up Form</h3>
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-field">
                    <div>Username</div>
                    <input
                        className="form-control"
                        {...register("username", {
                            required: "This field is required",
                            minLength: {
                                value: 4,
                                message: "Minimum length is 4"
                            },
                            validate: validate_username
                        })}
                    />
                    {errors.username && <div className="input-warning">{errors.username.message}</div>}
                </div>
                <div className="input-field">
                    <div>E-Mail</div>
                    <input
                        className="form-control"
                        type="email"
                        {...register("email", {
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                message: 'Invalid email format'
                            }
                        })}
                    />
                    {errors.email && <div className="input-warning">{errors.email.message}</div>}
                </div>
                <div className="input-field">
                    <div>Password</div>
                    <input
                        type="password"
                        className="form-control"
                        {...register("password", {
                            required: "This field is required",
                            minLength: {
                                value: 6,
                                message: "Minimum password length is 6"
                            }
                        })}
                    />
                    {errors.password && <div className="input-warning">{errors.password.message}</div>}
                </div>
                <div className="input-field">
                    <div>Repeat password</div>
                    <input
                        type="password"
                        className="form-control"
                        {...register("repeat_password", {
                            validate: (value) => {
                                if (watch('password') !== value) {
                                    return "Your passwords do not match";
                                }
                            }
                        })}
                    />
                    {errors.repeat_password && <div className="input-warning">{errors.repeat_password.message}</div>}
                </div>
                <button className="btn btn-primary" type="submit">Submit</button>
                {submitError && <div className="input-warning">{submitError}</div>}
            </form>
        </div>
    )
}