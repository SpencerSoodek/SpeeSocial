import { useState } from "react";
 import { useDispatch } from "react-redux";
import { createReply } from "../store/reducers/posts";

const ReplyToPost = ({parentPost}) => {

    const [replyText, setReplyText] = useState("");

    const dispatch = useDispatch();

    const onReply = (e) => {
        e.preventDefault();
        dispatch(createReply({parentPost, replyText}));
        setReplyText("");
    }

    return (
        <div className="bg-base-100 mx-auto  p-3 text-left">
            <p className="text-xl font-semibold text-primary mr-2 p-2">Reply</p>
            <div contentEditable="true" className="bg-base-100 w-full p-2 resize-none focus:outline-none"
                placeholder="What's up?"
                rows={3}
                maxLength={280}
                role="textbox"
                onInput={(e) => setReplyText(e.target.innerText)}>
            </div>
            <div className="flex justify-end mb-2">
            {replyText.trim().length > 0?
                <button
                    className="btn btn-primary btn-sm flow-*" onClick={onReply}>Reply</button> :
                <button
                    className="btn btn-disabled btn-sm">Reply</button>
            }
            </div>
        </div>
    )
};

export default ReplyToPost;