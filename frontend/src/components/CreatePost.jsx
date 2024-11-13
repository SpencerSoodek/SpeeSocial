import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../store/reducers/posts";

const CreatePost = () => {
    const [postText, setPostText] = useState("");
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const dispatch = useDispatch();

    const onPost = (e) => {
        e.preventDefault();
        dispatch(createPost({postText}));
        setPostText("");
    }


    return (
        <div className="bg-base-200 mx-auto border border-color-content-neutral border-t-0 p-3 text-left">
            <p className="text-xl font-semibold text-primary mr-2 p-2">{user.displayName}</p>
            <div contentEditable="true" className="bg-base-200 w-full p-2 resize-none focus:outline-none"
                placeholder="What's up?"
                rows={3}
                maxLength={280}
                role="textbox"
                onInput={(e) => setPostText(e.target.innerText)}>
            </div>
            <div className="flex justify-end mb-2">
            {postText.trim().length > 0?
                <button
                    className="btn btn-primary btn-sm flow-*" onClick={onPost}>Post</button> :
                <button
                    className="btn btn-disabled btn-sm">Post</button>
            }
            </div>
        </div>
    )

}
export default CreatePost;