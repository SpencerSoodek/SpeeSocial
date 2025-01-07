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
        }
    };

    const handleInput = (e) => {
        const text = e.target.innerText.slice(0, 20);
        setSearchTerm(text);
    };

    const handleResultClick = (userId) => {
        navigate(`/profile/${userId}`);
        setResultsVisible(false);
    };

    return (
        <div className="relative">
            <div
                contentEditable="true"
                className="resize-none bg-base-100 p-2 pl-4 focus:outline-none min-w-96 rounded-full placeholder:text-neutral-400 text-content whitespace-nowrap overflow-hidden"
                role="textbox"
                aria-placeholder="Search"
                suppressContentEditableWarning={true}
                onInput={(e) => {
                    handleInput(e);
                    if (e.target.innerText.trim().length >= 2) {
                        onSearchForUsers();
                    }
                }}
                onFocus={() => setResultsVisible(true)}
                onBlur={(e) => {
                    if (!e.relatedTarget || !e.relatedTarget.closest('.search-result')) {
                        setResultsVisible(false);
                    }
                }}>
                {searchTerm === "" && <span className="text-neutral-400">Search</span>}
            </div>
            {users.length > 0 && resultsVisible && (
                <div className="absolute left-0 mt-2 w-full bg-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="search-result px-4 py-2 hover:bg-base-200 cursor-pointer"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                handleResultClick(user._id);
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
