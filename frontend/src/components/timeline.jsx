import { useSelector } from "react-redux";
import Post from "./Post";

const Timeline = () => {
    const {posts, isLoading} = useSelector(state => state.posts);

    return (
        <div className="w-full">
            <h1>{isLoading}</h1>
            {isLoading && posts.length === 0 ? (
                <p>Loading...</p>) :
            posts.map(post => (
                <div key={post._id}>
                    <Post post={post} />

                </div>
            ))}
        </div>
    )
} 
export default Timeline;