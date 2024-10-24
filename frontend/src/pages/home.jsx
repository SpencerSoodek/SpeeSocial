import { useDispatch } from "react-redux";
//import { useNavigate } from "react-router-dom";
import { logout } from "../store/reducers/auth";

const Home = () => {
    const dispatch = useDispatch();
    //const navigate = useNavigate();
    const onLogout = (e) => {
        e.preventDefault();
        dispatch(logout()).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
        });
    }
    return (
        <>
        <div>
            <h1>Current User: {JSON.parse(localStorage.getItem('currentUser'))?.username}</h1>
            <p className="text-5xl text-red-500 bg-blue-300">
                home page</p>
                <button className="btn btn-primary">Button</button>
                <button className="btn btn-warning" onClick={onLogout}>Logout</button>
        </div>
        </>
    )
}
export default Home;