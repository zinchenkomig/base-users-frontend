import axios from "../api/backend";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";



export default function SignUp() {
  const { register, watch, handleSubmit, setError, formState: { errors } } = useForm({ mode: "onBlur" });
  const [submitError, setSubmitError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  async function validate_email(email) {
    const isExists = await axios.get('/auth/check/email', { params: { email: email } })
      .then((response) => { return response.data; })
      .catch((_) => {})
    return !isExists || `Email ${email} is already registered`
  }

  function onSubmit(data) {
    setIsLoading(true)
    axios.post('/auth/register', data)
      .then(function(response) {
        if (response.status === 201) {
          navigate('/signup_success')
          setIsLoading(false)
        }
      })
      .catch(function(error) {
        if (error?.response?.status === 409) {
          setError("email", { type: "focus", message: "Email already exists" })
        } else {
          setSubmitError("User creation failed!")
        }
        setIsLoading(false)
      });
  }

  return (
    <div className="login-content mt-10">
      <div className="login-frame">
        <div className="text-2xl mb-8">Sign Up Form</div>
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-field text-md">
            <div>First Name</div>
            <input
              className="login-input"
              type="text"
              {...register("first_name", {
                minLength: {
                  value: 3,
                  message: "Minimum length is 3"
                },
              })}
            />
            {errors.first_name && <div className="input-warning">{errors.first_name.message}</div>}
          </div>
          <div className="input-field text-md">
            <div>E-Mail</div>
            <input
              className="login-input"
              type="email"
              {...register("email", {
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
          <div className="input-field text-md">
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
          <div className="input-field text-md">
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
          <button className="btn btn-primary mt-8" type="submit">Submit</button>
          {isLoading &&
            <div className="center indent-top">
              <div className="loader" />
            </div>}
          {submitError && <div className="input-warning">{submitError}</div>}
        </form>
      </div>
    </div>
  )
}
