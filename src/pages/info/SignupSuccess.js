import {Link} from "react-router-dom";

export default function SignupSuccess(){
    return (
        <div className="center">
            <div className="message-frame">
            <h3>Sign Up successful</h3>
            <div>Now you need to verify your email. We sent you a message with a verification link</div>
            <Link to="/login" className="indent-top">To Login Page</Link>
        </div>
        </div>
    )
}