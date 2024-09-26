import {Link} from "react-router-dom";

export default function SignupSuccess(){
    return (
        <div className="center mt-10">
            <div className="message-frame text-md">
                <div className="text-2xl mb-6">Sign Up successful</div>
                <div>Now you need to verify your email. We sent you a message with a verification link</div>
                <Link to="/login" className="mt-12 underline text-xl">To Login Page</Link>
            </div>
        </div>
    )
}