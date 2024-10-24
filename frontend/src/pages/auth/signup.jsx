import { useState } from "react";
import {useDispatch} from "react-redux";
import { signup } from "../../store/reducers/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = (e) => {
        e.preventDefault();
        console.log("register", username, email, password, privateAccount);
        dispatch(signup({username, email, password, privateAccount})).then(action => {
            localStorage.setItem('token', action.payload.token);
            navigate("/");
        });
    };

    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[privateAccount, setPrivateAccount] = useState(false);


    return (
            <div className="min-h-screen flex items-center justify-center">
            <form className="max-w-sm mx-auto">
                <div className = "mb-5">
            <input type="text" placeholder="username" className="input input-bordered w-full max-w-xs" onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="mb-5">
            <input type="email" placeholder="email" className="input input-bordered w-full max-w-xs" onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="mb-5">
            </div>
            <div className="mb-5">
            <input type="password" placeholder="password" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <label className="label cursor-pointer">
                <span className="label-text">Private Account:</span>
                <input type="checkbox" className="toggle" checked={privateAccount} onChange={(e) => setPrivateAccount(e.target.checked)}/>
            </label>
            <div className="max-w-sm mx-auto">
                <button className ="btn btn-primary" onClick={onSubmit}>Signup</button>
            </div>
            <div className="flex text-center padding-md">
            <label className="label text-sm text-center" htmlFor="signup">Already have an account?</label>
            <button className = "btn btn-secondary btn-sm" id="signup" onClick={() => navigate("/login")}>Login</button>
            </div>
        </form>
        </div>
    )
}

export default Signup;