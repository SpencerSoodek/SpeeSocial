import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getFollowRequests, acceptRequest, declineRequest } from "../../store/reducers/followRequestsReducer";

const FollowRequests = () => {

    const dispatch = useDispatch();
    const {isLoading, followRequests} = useSelector(state => state.followRequestsReducer);

    useEffect(() => {
        dispatch(getFollowRequests());
    }, [dispatch]);

    const onAccept = (e) => {
        e.preventDefault();
        dispatch(acceptRequest(e.target.value));
    }

    const onDecline = (e) => {
        e.preventDefault();
        dispatch(declineRequest(e.target.value));
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="border border-neutral-content p-3 bg-base-100 mx-auto text-left pt-5 pb-5">
            <h1 className="text-2xl font-bold mb-4 text-center">FollowRequests</h1>
            </div>
                {followRequests.length === 0 ? (
                    <p>No follow requests</p>
                )  :
                followRequests.map(followRequest => (
                    <div className="max-w-lg mx-auto border border-neutral-content p-3" key={followRequest.sender._id}>
                        <div className="flex items-center whitespace-nowrap mb-1">
                        <p className="text-xl font-semibold text-primary mr-2">{followRequest.sender.displayName}</p>
                        <p className="text-lg font-semibold text-gray-500">{followRequest.sender.username}</p>
                        <button className="btn btn-primary btn-sm ml-auto text-bold" onClick={onAccept} value={followRequest._id}>Accept</button>
                        <button className="btn btn-error btn-sm ml-2 text-bold" onClick={onDecline} value={followRequest._id}>Decline</button>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default FollowRequests;