import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Zap, User, LogOut, Menu } from "lucide-react";

function Header() {
  const { authUser, logout } = useAuthStore();

  const [dropdown, setDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <header className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white hidden sm:inline">
                Date-Night
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="md:flex hidden space-x-4 items-center  ">
            {authUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={authUser.image || "/avatar.png"}
                    alt="User Avatar"
                    className="h-10 w-10 object-cover rounded-full border-2 border-white"
                  />
                  <span className="text-white font-medium">
                    {authUser.name}
                  </span>
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm"
                    >
                      <User className="mr-2" size={16} />
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="px-4 py-2  w-full text-left  text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="mr-2" size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white  hover:text-pink-200 transition duration-300 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white  hover:text-pink-600 px-4 py-2 rounded-full font-medium hover:bg-pink-100 transition duration-300 ease-in-out"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          {/*------MOBILE MENU------ */}
          {/*/**
           * This div contains a button that toggles the mobile menu.
           * It is only visible on small screens (md:hidden).
           * When clicked, it sets the state of `mobileMenuOpen` to its opposite value.
           * The button contains an icon (Menu) that indicates the presence of a menu. */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="focus:outline-none text-white "
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {/* when the mobile menu is open, a div containing the menu items is displayed. */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-pink-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {authUser ? (
              <>
                <Link
                  to={"/profile"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md font-medium text-white text-base hover:bg-pink-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={"/auth"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2  rounded-md text-base font-medium  text-white hover:bg-pink-700"
                >
                  Login
                </Link>
                <Link
                  to={"/auth"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2  rounded-md text-base font-medium  text-white hover:bg-pink-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
