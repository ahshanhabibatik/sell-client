import { FaSearch } from "react-icons/fa";


const SearchBar = () => {
    return (
        <div className="flex items-center bg-white rounded-full shadow-sm overflow-hidden max-w-md w-full mx-4">
            <input
                type="text"
                placeholder="Search products..."
                className="p-2 w-full text-gray-700 outline-none placeholder-gray-500"
            />
            <button className="p-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-200">
                <FaSearch />
            </button>
        </div>

    );
};

export default SearchBar;