import TinderCard from "react-tinder-card";
import { useMatchStore } from "../store/useMatchStore";

const SwipeArea = () => {
  const { userProfiles, swipeRight, swipeLeft } = useMatchStore();

  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user);
    else if (dir === "left") swipeLeft(user);
  };

  //Inbuilt TinderCard component to render the user profiles with custom styling
  return (
    <div className="relative w-full max-w-sm h-[28rem]">
      {userProfiles.map((user) => (
        <TinderCard
          key={user._id} // Unique identifier for each card
          className="absolute shadow-none" // Positioning and styling
          onSwipe={(dir) => handleSwipe(dir, user)} // Logs swipe direction
          swipeRequirementType="position" // Swipe based on position movement
          swipeThreshold={100} // Minimum swipe distance (100px)
          preventSwipe={["up", "down"]} // Only allow left/right swipes
        >
          {/* Render content inside the card */}
          <div className="card bg-white w-96 h-[28rem] select-none rounded-lg overflow-hidden border border-gray-200 shadow-lg">
            <figure className="px-4 pt-4 h-3/4">
              <img
                src={user.image || "/avatar.png"}
                alt={user.name}
                className="rounded-lg object-cover h-full pointer-events-none"
              />
            </figure>
            <div className="card-body bg-gradient-to-b from-white to-pink-50">
              <h2 className="card-title text-2xl text-gray-800">
                {user.name}, {user.age}
              </h2>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default SwipeArea;
