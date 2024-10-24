import {useState} from "react";
import {useDispatch} from "react-redux";
import { login } from "../../store/reducers/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        console.log("login", username, password);
        dispatch(login({username, password})).then(action => {
            localStorage.setItem('token', action.payload.token);
            navigate("/");
        });
    };

    return (
    <div className="min-h-screen flex items-center justify-center">
        <form className="max-w-sm mx-auto">
            <div className = "mb-5">
                <input type="text" placeholder="username" className="input input-bordered w-full max-w-xs" onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className = "mb-5">
                <input type="text" placeholder="password" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="max-w-sm mx-auto">
                <button className ="btn btn-primary" onClick={onSubmit}>Login</button>
            </div>
            <div className="flex text-center padding-top-md">
            <label className="label text-sm text-center" htmlFor="signup">Don&apos;t have an account?</label>

            <button className = "btn btn-secondary btn-sm" id="signup" onClick={() => navigate("/signup")}>Signup</button>
            </div>
        </form>
    <br/>
    </div>
    )
}
export default Login;