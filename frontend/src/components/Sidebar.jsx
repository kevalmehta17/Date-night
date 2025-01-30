import { Heart, Loader, MessageCircle, X } from "lucide-react"; // Importing the "X" icon from the lucide-react library
import { useEffect, useState } from "react"; // Importing useState hook for managing sidebar state
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";

const Sidebar = () => {
  // State to track whether the sidebar is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the sidebar's visibility
  const toggleSidebar = () => setIsOpen(!isOpen);

  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();

  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Loader className="text-pink-500 mb-4 animate-spin" size={48} />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Loading Matches
      </h3>
      <p className="text-gray-500 max-w-xs">
        We&apos;re finding your perfect matches. This might take a moment...
      </p>
    </div>
  );

  const NoMatchesFound = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Heart className="text-pink-500 mb-4" size={48} />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Matches Yet{" "}
      </h3>
      <p className="text-gray-500 max-w-xs">
        Don&apos;t worry! Your perfect match is just around the corner. Keep
        swiping!
      </p>
    </div>
  );

  return (
    // Sidebar container with responsive behavior and animation
    <>
      <div
        className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md overflow-hidden 
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:w-1/4
      `}
      >
        {/* Main wrapper for sidebar content */}
        <div className="flex flex-col w-full">
          {/* HEADER */}
          <div className="p-4 pb-[27px] border-b border-pink-300 flex justify-between items-center">
            {/* Sidebar title */}
            <h2 className="text-xl text-pink-600 font-bold">Matches</h2>

            {/* Close button - Visible only on small screens */}
            <button
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar} // Toggles the sidebar visibility on click
            >
              <X size={24} /> {/* Icon for the close button */}
            </button>
          </div>

          {/* Main content area for matches */}
          <div className="flex-grow overflow-y-auto p-4 z-10 relative">
            {isLoadingMyMatches ? (
              <LoadingState />
            ) : matches.length === 0 ? (
              <NoMatchesFound />
            ) : (
              matches.map((match) => (
                <Link key={match._id} to={`/match/${match._id}`}>
                  <div className="flex items-center mb-4 cursor-pointer hover:bg-pink-100 p-2 rounded-lg transition-colors duration-300">
                    <img
                      src={match.image || "/avatar.png"}
                      alt="User image"
                      className="size-12 object-cover rounded-full mr-4 border-2 border-pink-300"
                    />
                    <h3 className="font-semibold text-gray-800">
                      {match.name}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Sidebar overlay for small screens */}
      <button
        className="lg:hidden fixed top-4 left-4 p-2 bg-pink-500 text-white rounded-md z-0"
        onClick={toggleSidebar}
      >
        <MessageCircle size={24} />
      </button>{" "}
    </>
  );
};

export default Sidebar;
