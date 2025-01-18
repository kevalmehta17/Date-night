import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <h2 className="text-white text-center mb-8 text-3xl font-extrabold">
          {isLogin ? "Sign in to Date-night" : "Create an Date-night account"}
        </h2>
        <div className="bg-purple-100  shadow-2xl rounded-lg p-8">
          {isLogin ? <LoginForm /> : <SignUpForm />}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              {isLogin ? "New to Date-night?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
              className="mt-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-300"
            >
              {isLogin ? "Create a new account" : "Sign in to account "}{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
