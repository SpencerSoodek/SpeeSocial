import { useState } from "react";
import { updateProfile } from "../store/reducers/profileReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EditProfileMenu = ({ profile, closeMenu }) => {
    const originalUsername = profile?.username;
    const [username, setUsername] = useState(profile?.username || "");
    const [displayName, setDisplayName] = useState(profile?.displayName || "");
    const [bio, setBio] = useState(profile?.bio || "");
    const dispatch = useDispatch();
    const { isError, message } = useSelector((state) => state.profileReducer);
    const navigate = useNavigate();

    const handleClose = () => {
        closeMenu();
    };

    const handleSubmit = async () => {
        try {
            // Dispatch the action and wait for completion
            const result = await dispatch(updateProfile({ username, displayName, bio })).unwrap();

            // Handle navigation and closing the menu based on the response
            if (result && !isError) {
                if (username !== originalUsername) {
                    navigate(`/profile/${username}`);
                }
                closeMenu();
            }
        } catch (error) {
            console.error("Failed to update profile:", message || error);
        }
    };

    return (
        <div className="border border-neutral-content p-3 bg-base-100 mx-auto text-left pt-5 pb-5">
            <form className="form-control justify-end">
            <label className="text-sm label pb-1" htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-half max-w-md input-sm rounded-md"
            />

            <label className="text-sm label pb-1" htmlFor="displayName">Display Name (optional)</label>
            <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input input-bordered w-half max-w-md input-sm rounded-md"
            />

            <label className="text-sm label pb-1" htmlFor="bio">Bio (optional)</label>
            <textarea
                id="bio"
                value={bio}s
                onChange={(e) => setBio(e.target.value)}
                className="textarea textarea-bordered w-full max-w-md textarea-sm rounded-md"
            ></textarea>
            <div className="flex justify-end mr-7 mt-2">
            <button type="button" className="btn btn-md btn-warning m-1" onClick={handleClose}>Cancel</button>
            <button type="button" className="btn bt-md btn-primary m-1" onClick={handleSubmit}>Save</button>
            </div>
            </form>
        </div>
    );
};

export default EditProfileMenu;
