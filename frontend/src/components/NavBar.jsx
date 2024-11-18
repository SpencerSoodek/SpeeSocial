import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {BsThreeDots} from "react-icons/bs"
import { useDispatch } from "react-redux"
import { logout } from "../store/reducers/auth";

const NavBar = () => {
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const navHome = () => {
        navigate("/");
    }

    const navToMyProfile = () => {
        navigate(`/profile/${auth.currentUser.username}`);
    }

    const navToBlockedUsers = () => {
        navigate("/blockedUsers");
    }

    const navToFollowRequests = () => {
        navigate("/followRequests");
    }

    const onLogout = (e) => {
        e.preventDefault();
        dispatch(logout()).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
        });
    }

    return (
        <div className="navbar bg-neutral text-neutral-content mb-5 w-full">
            <div className="flex-1">
                <button className="btn btn-ghost normal-case text-xl" onClick={navHome}>Spee Social</button>
                </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <button className="btn btn-primary btn-sm flow- font-semibold" onClick={navToMyProfile}>{auth.currentUser?.displayName || auth.currentUser?.username}</button>
                </ul>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className = "rounded-full">
                            <BsThreeDots className="text-2xl"/>
                        </div>
                    </div>
                    <ul tabIndex={0} className = "menu menu-sm dropdown-content bg-neutral rounded-box w-52 z-[1] mt-3 p-2">
                        <li>
                            <a onClick={onLogout}>Logout</a>
                            {auth.currentUser && auth.currentUser.privateAccount &&
                            <a onClick={navToFollowRequests}>View Follow Requests</a>}
                            <a onClick={navToBlockedUsers}>View Blocked Users</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar;