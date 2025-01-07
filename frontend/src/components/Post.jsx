import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {BsThreeDots} from "react-icons/bs"
import BlockModal from './BlockUserModal';
import { useState } from 'react';
import { blockUser } from '../store/reducers/followReducer';
import { useDispatch } from 'react-redux';
import DeletePostModal from './DeletePostModal';
import { deletePost } from '../store/reducers/posts';

const Post = (props) => {
    const {currentUser} = useSelector(state => state.auth);
    const {text, author, _id, parentPost} = props.post;
    const userName = author.username;
    const displayName = author.displayName;
    const myPost = author._id.toString() === currentUser._id.toString();
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

    const handleOpenDeleteModal = (event) => {
        event.stopPropagation();
        if (myPost) {
        setIsDeleteModalOpen(true);
        }
    }

    const handleConfirmDelete = (event) => {
        event.stopPropagation();
        dispatch(deletePost(_id)).then(() => setIsDeleteModalOpen(false));
    }

    const handleCancelDelete = (event) => {
        event.stopPropagation();
        setIsDeleteModalOpen(false);
    }
    
    return (
        <div className="border border-neutral-content p-3 bg-base-300 mx-auto text-left" onClick={handlePostClick}>
            <div>
                {parentPost && parentPost.author && parentPost.author.username?
                    <a className = "text-sm text-gray-500" href={`/post/${parentPost._id}`}>Replying to : {parentPost.author.username}</a>
                    : null}
            <div className="flex items-center whitespace-nowrap mb-1" onClick={handleProfileClick}>
                {displayName &&
                <p className="text-xl font-semibold text-primary mr-2">{displayName}</p>}
                <p className="text-lg font-semibold text-gray-500">{userName}</p>
                <div className='dropdown dropdown-end justify-end'>
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={handleDropdownClick}>
                        <div className = "rounded-full">
                            <BsThreeDots className="text-lg"/>
                        </div>
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mb-2">
                        {!myPost &&
                        <li><a onClick={handleOpenBlockModal}>Block User</a></li>}
                        {myPost &&
                        <li><a onClick={handleOpenDeleteModal}>Delete Post</a></li>}
                        
                        </ul>
                </div>

            </div>
            </div>
            <p className="text-lg">{text}</p>
            <BlockModal userName={userName} isOpen={isBlockModalOpen} onConfirm={handleConfirmBlock} onClose={handleCancelBlock}/>
            <DeletePostModal isOpen={isDeleteModalOpen} onClose={handleCancelDelete} onConfirm={handleConfirmDelete}/>
        </div>
    )
    
}

export default Post;