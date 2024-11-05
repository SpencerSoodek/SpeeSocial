import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getProfilePosts } from "../../store/reducers/profileReducer";
import Post from "../../components/Post";

const ProfilePage = () => {
    const { username } = useParams();
    const dispatch = useDispatch();

    const { profile, posts, blocked, private: isPrivate, isLoading, isError, errorMessage, myProfile, following } = useSelector(state => state.profileReducer);
    
    const currentUser = useMemo(() => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }, []);

    useEffect(() => {
        if (username) {
            console.log("username", username);
            dispatch(getProfile(username));
        }
    }, [username, dispatch]);

    useEffect(() => {
        if (
            profile && 
            !blocked && 
            (!isPrivate || (isPrivate && profile.followers?.includes(currentUser?._id)))
        ) {
            console.log(profile._id);
            dispatch(getProfilePosts(profile._id));
        }
    }, [profile, blocked, isPrivate, dispatch, currentUser]);

    return (
        <div className="max-w-lg mx-auto">
            {isLoading ? (
                <p>Loading...</p>
            ) : isError ? (
                <p>Error: {errorMessage || 'Something went wrong'}</p>
            ) : (
                <>
                <div className="border border-neutral-content p-3 bg-base-100 mx-auto text-left pt-5 pb-5">
                    <h1 className="text-2xl font-bold mb-4 text-primary">{profile?.displayName || 'User Profile'}</h1>
                    <p className="text-lg text-gray-500 pb-3">{profile?.username}</p>
                    <p className="text-lg">{profile?.bio}</p>
                    <div className="flex justify-end mb-2">
                        {myProfile?  (
                            <button className="btn btn-primary btn-md" >Edit Profile</button>
                        ) :
                        following? (
                            <button className="btn btn-secondary btn-md" >Following</button>
                        ) :
                        <button className="btn btn-primary btn-md" >Follow</button>
                    }
                    </div>

                    </div>
                    <h2>Posts</h2>
                    {posts.length > 0 ? (
                        <ul>
                            {posts.map(post => (
                                <Post key={post._id} post={post} />
                            ))}
                        </ul>
                    ) : (
                        <p>No posts available</p>
                    )}
                </>
            )}
        </div>   
    );
}

export default ProfilePage;
