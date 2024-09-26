import {useLoaderData, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "../api/backend";
import {useForm} from "react-hook-form";

export default function RecoverPassword(){
    const { register, watch, handleSubmit, formState: { errors } } = useForm({mode: "onBlur"});
    const data = useLoaderData();
    const [submitError, setSubmitError] = useState(null)
    const navigate = useNavigate()


    function onSubmit(form_data) {
        let submit_data = form_data
        submit_data["token"] = data["token"]
        submit_data["new_password"] = form_data["password"]
        axios.post("/user/forgot_password/verify", submit_data).then(
            (response) => {
                if (response.status === 200){
                    navigate("/profile")
                }
            }
        ).catch((error) => {
            setSubmitError(error.response.status)
        })
    }
    return (
        <div className="content-container mt-10">
            <div className="center">
                <h2>Password Recovery</h2>
                <p>Fill the new password for your account</p>
                <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-field">
                <div>Password</div>
                <input
                    type="password"
                    className="login-input"
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
                    className="login-input"
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
        </div>
    )
}