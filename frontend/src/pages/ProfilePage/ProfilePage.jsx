import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getProfilePosts } from "../../store/reducers/profileReducer";
import { followingUser, followUser, unfollowUser } from "../../store/reducers/followReducer";
import Post from "../../components/Post";

const ProfilePage = () => {
    const { username } = useParams();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    const { profile, posts, blocked, private: isPrivate, isLoading, isError, errorMessage, following } = useSelector(state => state.profileReducer);
    const { followingStatus, isLoading: followingIsLoading, isError: followingIsError } = useSelector(state => state.followReducer.followingUsers[profile?._id] || {});
    
    
    const currentUser = useMemo(() => {
        const user = auth.currentUser
        return user;
    }, []);

    const myAccount = useMemo(() => {
        if (!profile) return false;
        return profile._id === auth.currentUser._id;
    }, [auth.currentUser._id, profile]);

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
            (!isPrivate || (isPrivate && profile.following) || profile.myAccount)
        ) {
            console.log(profile._id);
            dispatch(getProfilePosts(profile._id));
        }
    }, [profile, blocked, isPrivate, dispatch, currentUser]);

    useEffect(() => {
        if (!blocked && profile?._id) {
            dispatch(followingUser(profile._id));
        }
    }, [dispatch, profile, blocked, followingStatus]);

    const onFollow = (e) => {
        e.preventDefault();
        dispatch(followUser(profile._id));
    }

    const onUnfollow = (e) => {
        e.preventDefault();
        dispatch(unfollowUser(profile._id));
    }

    return (
        <div className="max-w-lg mx-auto">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                {
                    console.log("blocked", blocked, "isPrivate", isPrivate, "following", following, "myAccount", myAccount)
                }
                <div className="border border-neutral-content p-3 bg-base-100 mx-auto text-left pt-5 pb-5">
                    {profile.displayName &&<h1 className="text-2xl font-bold mb-4 text-primary">{profile?.displayName}</h1>}
                    <p className="text-lg font-semibold text-gray-500 pb-3">{profile?.username}</p>
                    {profile?.bio && <p className="text-md text-gray-50">{profile?.bio}</p>}
                    <div className="flex justify-end mb-2">
                        {profile?.myAccount ? (
                            <button className="btn btn-primary btn-md">Edit Profile</button>
                        ) : !followingIsLoading && !followingIsError&& !isLoading ? (
                            (() => {
                                switch (followingStatus) {
                                    case "me":
                                        return <button className="btn btn-primary btn-md">Edit Profile</button>;
                                    case "following":
                                        return <button className="btn btn-secondary btn-md" onClick={onUnfollow}>Following</button>;
                                    case "not following":
                                        return <button className="btn btn-primary btn-md" onClick={onFollow}>Follow</button>;
                                    case "requested":
                                        return <button className="btn btn-disabled btn-md">Pending</button>;
                                    default:
                                        return <button className="btn btn-primary btn-md">Follow</button>;
                                }
                            })()
                        ) : (
                            <p>Loading follow status...</p>
                        )}
                    </div>
                </div>
                
                {blocked ? 
                    <p>You are blocked by this user.</p> :
                    (isPrivate && !following && !myAccount) ? (
                        <p>This user is private. Only followers can view their posts.</p>
                    ) : posts.length > 0 ? (
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
