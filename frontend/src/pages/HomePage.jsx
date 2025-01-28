import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";

function HomePage() {
  const { isLoadingUserProfile, getUserProfiles, userProfiles } =
    useMatchStore();

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  console.log("User Profiles", userProfiles);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-pink-200 to-purple-200 overflow-hidden ">
      <Sidebar />
    </div>
  );
}

export default HomePage;
