import {useForm} from "react-hook-form";
import axios from "../api/backend";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function ForgotPassword(){
    const { register, handleSubmit, formState: { errors } } = useForm({mode: "onBlur"});
    const [submitError, setSubmitError] = useState(null)
    const navigate = useNavigate();

    async function validate_email(email){
        const is_exists = await axios.get('/check/email', {params: {email: email}})
            .then((response)=>{return response.data;}
            )
            .catch((reason)=>{console.log(reason)})
        return is_exists || `Email ${email} is not registered`
    }

    function onSubmit(data) {
        axios.post('/user/forgot_password', data)
            .then(function (response) {
                if (response.status === 200) {
                    navigate('/verification_sent')
                }
            })
            .catch(function (error) {
                if (error.message === "Network Error"){
                    setSubmitError("Sorry! Server is not available...");
                }
                else {
                    setSubmitError("Failed to send a verification message!")
                }
            });
    }

    return (
        <div className="login-content">
            <div className="message-frame">
            <h3>Forgot Password?</h3>
            <p>Please type your email. We will send you a verification link so you can change your password.</p>
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
                <div className="center">

            <div>
                Email: <input
                type="email"
                className="login-input"
                {...register("email", {
                    required: "This field is required",
                    pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                        message: 'Invalid email format'
                    },
                    minLength: {
                        value: 4,
                        message: "Minimum length is 4"
                    },
                    validate: validate_email
                })}
            />
                {errors.email && <div className="input-warning">{errors.email.message}</div>}
            </div>
                    <div className="indent-top">
                <button className="btn btn-primary" type="submit">Submit</button>
                {submitError && <div className="input-warning">{submitError}</div>}
                    </div>
                </div>
            </form>
            </div>
        </div>
    )
}