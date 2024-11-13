import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/reducers/auth";
import Timeline from "../components/timeline";
import { useState, useEffect } from "react";
import { getAllPosts, getFollowingPosts } from "../store/reducers/posts";
import CreatePost from "../components/CreatePost";

const Home = () => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const [timelineMode, setTimelineMode] = useState("all");

    const onLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    };

    useEffect(() => {
        if (timelineMode === "all") {
            dispatch(getAllPosts());
        } else if (timelineMode === "following") {
            dispatch(getFollowingPosts());
        }
    }, [dispatch, timelineMode]);

    return (
        <div className="max-w-lg mx-auto">
            {/* Toggle between All Posts and Following */}
            <div className="flex max-w-lg mx-auto">
                <div
                    className={`w-1/2 p-3 text-lg text-color-primary cursor-pointer border border-neutral-content ${
                        timelineMode === "all" ? " border-b-0" : ""
                    }`}
                    onClick={() => setTimelineMode("all")}
                >
                    All Posts
                </div>
                <div
                    className={`w-1/2 p-3 text-lg text-color-primary cursor-pointer border border-neutral-content ${
                        timelineMode === "following" ? "border-b-0" : ""
                    }`}
                    onClick={() => setTimelineMode("following")}
                >
                    Following
                </div>
            </div>

            {/* Post Creation Component */}
            <CreatePost />

            {/* Timeline Component */}
            <Timeline timelineMode={timelineMode} />
        </div>
    );
};

export default Home;
