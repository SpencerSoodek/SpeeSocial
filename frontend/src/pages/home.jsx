import { useDispatch } from "react-redux";
//import { useNavigate } from "react-router-dom";
import { logout } from "../store/reducers/auth";
import Timeline from "../components/timeline";
import { useState } from "react";
import { useEffect } from "react";
import { getAllPosts, getFollowingPosts } from "../store/reducers/posts";
import CreatePost from "../components/CreatePost";

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

    const [timelineMode, setTimelineMode] = useState("all");

    useEffect(() => {
        if (timelineMode === "all") {
            dispatch(getAllPosts());
        } else if (timelineMode === "following") {
            dispatch(getFollowingPosts());
        }
    }, [dispatch, timelineMode]);

    return (
        <>
        <div className="max-w-lg mx-auto">
            <h1>Current User: {JSON.parse(localStorage.getItem('currentUser'))?.username}</h1>

                <button className="btn btn-warning" onClick={onLogout}>Logout</button>
                <div className="flex justify-center max-w-lg mx-auto">
                    <div className="w-1/2 p-3 text-lg text-color-primary cursor-pointer border border-neutral-content" onClick={() => setTimelineMode("all")}>All Posts</div>
                    <div className=" w-1/2 p-3 text-lg text-color-primary cursor-pointer border border-neutral-content" onClick={() => setTimelineMode("following")}>Following</div>
             </div>
             <CreatePost />
                <h1>Timeline:</h1>
                <Timeline timelineMode={timelineMode} />
        </div>
        </>
    )
}
export default Home;