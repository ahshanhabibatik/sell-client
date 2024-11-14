import ModelUser from './ModelUser';
import AddToCart from './AddToCart';
import WishList from './WishList';
import SearchBar from './SearchBar';

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 flex flex-col sm:flex-row items-center sm:justify-between text-white relative">
            {/* Logo or Store Name - Aligned Left */}
            <div className="text-xl font-bold tracking-wide sm:mr-4 mb-2 md:mb-0">
                <h1>Resell Store</h1>
            </div>

            {/* Search Input for all screen sizes */}
            <div className="w-full sm:w-auto sm:flex-grow max-w-xs sm:max-w-md flex items-center ">
                <SearchBar />
            </div>

            {/* Icons section: aligned to the right */}
            <div className="flex sm:space-x-6 items-center justify-end sm:w-auto w-full mt-4 sm:mt-0">
                <div className="flex items-center space-x-4 sm:space-x-6">
                    <WishList />
                    <AddToCart />
                    <ModelUser />
                </div>
            </div>
        </header>
    );
};

export default Header;