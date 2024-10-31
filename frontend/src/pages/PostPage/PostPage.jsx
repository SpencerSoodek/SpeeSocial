import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPost } from "../../store/reducers/postPageReducer";
import { useParams } from "react-router-dom";
import Post from "../../components/Post";

export const PostPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    console.log("rendering post page")
    console.log("id: ", id);

    useEffect(() => {
        if (id) {
            console.log("postPage useEffect triggered with id:", id); // Confirm useEffect is triggered
            dispatch(getPost(id));
        } else {
            console.log("Post ID is undefined");
        }
    }, [dispatch, id]);


    const { post, isLoading, isError, errorMessage } = useSelector(state => state.postPageReducer);

    return (
        <div className="max-w-lg mx-auto">
            {isLoading ? (
                <p>Loading...</p>
            ) : isError ? (
                <p>Error: {errorMessage || "An error occurred while fetching the post."}</p>
            ) : ( post &&
                <div>
                <div className="border border-neutral-content p-3 bg-base-100 mx-auto text-left pt-5 pb-5" >
                    <div>
                    <div className="flex items-center whitespace-nowrap mb-2">
                        <p className="text-xl font-bold text-primary mr-2">{post.author.displayName}</p>
                        <p className="text-xl font-semibold text-gray-500">{post.author.username}</p>
                    </div>
                    </div>
                    <p className="text-xl">{post.text}</p>
                    </div>
                    {post.replies.length > 0 && (
                        post.replies.map((reply) => (
                            <Post key={reply._id} post={reply} />
                        ))
                    )}
                
                </div>
            )}
        </div>
    );
}

export default PostPage;
