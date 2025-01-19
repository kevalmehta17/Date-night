import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const { logout } = useAuthStore();
  return (
    <div>
      HomePage
      <button onClick={logout}> logout</button>
    </div>
  );
}

export default HomePage;
