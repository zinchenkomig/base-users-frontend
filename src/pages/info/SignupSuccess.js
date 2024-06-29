import {Link} from "react-router-dom";

export default function SignupSuccess(){
    return (
        <div className="content-container">
            <h3>Sign Up successful</h3>
            <div>Now you need to verify your email. We sent you a message with a verification link</div>
            <Link to="/login">To Login Page</Link>
        </div>
    )
}