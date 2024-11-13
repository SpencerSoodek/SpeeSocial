import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getBlockedUsers } from "../../store/reducers/followReducer";
import { unblockUser } from "../../store/reducers/followReducer";

const BlockedUsers = () => {
    const dispatch = useDispatch();
    const {isLoading, blockedUsers} = useSelector(state => state.followReducer);

    useEffect(() => {
        dispatch(getBlockedUsers());
    }, [dispatch]);

    const onUnblock = (e) => {
        e.preventDefault();
        dispatch(unblockUser(e.target.value));
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="border border-neutral-content p-3 bg-base-100 mx-auto text-left pt-5 pb-5">
            <h1 className="text-2xl font-bold mb-4 text-center">Blocked Users</h1>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                blockedUsers.length === 0 ? (
                    <p>No blocked users</p>
                )  :
                blockedUsers.map(user => (
                    <div className="max-w-lg mx-auto border border-neutral-content p-3" key={user._id}>
                        <div className="flex items-center whitespace-nowrap mb-1">
                        <p className="text-xl font-semibold text-primary mr-2">{user.displayName}</p>
                        <p className="text-lg font-semibold text-gray-500">{user.username}</p>
                        <button className="btn btn-error btn-sm ml-auto text-bold" onClick={onUnblock} value={user._id}>Unblock</button>
                        </div>
                    </div>
                ))
            )
        }
    </div>)
};

export default BlockedUsers;