import { useNavigate } from 'react-router-dom';

const Post = (props) => {
    const {text, author, _id} = props.post;
    const userName = author.username;
    const displayName = author.displayName;

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/post/${_id}`);
    }
    return (
        <div className="border border-neutral-content p-3 bg-base-300 mx-auto text-left" onClick={handleClick}>
            <div>
            <div className="flex items-center whitespace-nowrap mb-2">
                <p className="text-xl font-semibold text-primary mr-2">{displayName}</p>
                <p className="text-lg font-semibold text-gray-500">{userName}</p>
            </div>
            </div>
            <p className="text-lg">{text}</p>
        </div>
    )
    
}

export default Post;