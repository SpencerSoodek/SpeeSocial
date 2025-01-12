import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../store/reducers/searchReducer";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.searchReducer.users);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [resultsVisible, setResultsVisible] = useState(false);

    const onSearchForUsers = () => {
        if (searchTerm.trim().length >= 2) {
            dispatch(searchUsers(searchTerm));
            setResultsVisible(true);
        }
    };

    const handleResultClick = (userId) => {
        navigate(`/profile/${userId}`);
        setResultsVisible(false);
    };

    return (
        <div className="relative">
            <input type="text" placeholder="Search" className="input input-bordered w-full max-w-md"
                onFocus={() => setResultsVisible(true)}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.trim().length >= 2) {
                        onSearchForUsers();
                    } else {
                        setResultsVisible(false);
                    }
                }}
            />
            {users.length > 0 && resultsVisible && (
                <div className="absolute left-0 mt-2 w-full bg-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="search-result px-4 py-2 hover:bg-base-200 cursor-pointer"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                handleResultClick(user.username);
                            }}>
                            {user.username}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
