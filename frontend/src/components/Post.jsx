import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {BsThreeDots} from "react-icons/bs"
import BlockModal from './BlockUserModal';
import { useState } from 'react';
import { blockUser } from '../store/reducers/followReducer';
import { useDispatch } from 'react-redux';

const Post = (props) => {
    const {currentUser} = useSelector(state => state.auth);
    const {text, author, _id, parentPost} = props.post;
    const userName = author.username;
    const displayName = author.displayName;
    const myPost = author._id.toString() === currentUser._id.toString();
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const handlePostClick = () => {
        navigate(`/post/${_id}`);
    }

    const handleProfileClick = (event) => {
        event.stopPropagation();
        if (userName) {
        navigate(`/profile/${userName}`);
        }
    }

    const handleDropdownClick = (event) => {
        event.stopPropagation();
    };

    const handleOpenBlockModal = (event) => {
        event.stopPropagation();
        if (!myPost) {
        setIsBlockModalOpen(true);
        }
    }

    const handleConfirmBlock = (event) => {
        event.stopPropagation();
        dispatch(blockUser(author._id)).then(() => setIsBlockModalOpen(false));
    }

    const handleCancelBlock = (event) => {
        event.stopPropagation();
        setIsBlockModalOpen(false);
    }
    
    return (
        <div className="border border-neutral-content p-3 bg-base-300 mx-auto text-left" onClick={handlePostClick}>
            <div>
                {parentPost && parentPost.author && parentPost.author.username?
                    <a className = "text-sm text-gray-500" href={`/post/${parentPost._id}`}>Replying to : {parentPost.author.username}</a>
                    : null}
            <div className="flex items-center whitespace-nowrap mb-1" onClick={handleProfileClick}>
                <p className="text-xl font-semibold text-primary mr-2">{displayName}</p>
                <p className="text-lg font-semibold text-gray-500">{userName}</p>
                <div className='dropdown dropdown-end justify-end'>
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={handleDropdownClick}>
                        <div className = "rounded-full">
                            <BsThreeDots className="text-lg"/>
                        </div>
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mb-2">
                        <li><a onClick={handleOpenBlockModal}>Block User</a></li>
                        
                        </ul>
                </div>

            </div>
            </div>
            <p className="text-lg">{text}</p>
            <BlockModal displayName={displayName} isOpen={isBlockModalOpen} onConfirm={handleConfirmBlock} onClose={handleCancelBlock}/>
        </div>
    )
    
}

export default Post;