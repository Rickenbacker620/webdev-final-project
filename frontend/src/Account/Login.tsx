import { useNavigate } from "react-router";
import { fetchClient } from "../api/client";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const { loginMutation } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("Login form submitted");
    await loginMutation.mutateAsync({
      body: {
        username,
        password,
        grant_type: "password",
        scope: "",
      },
      bodySerializer(body) {
        return new URLSearchParams(body).toString();
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  };

  return (
    <div className="max-w-lg w-1/4 min-w-[300px] mt-20 rounded-xl shadow-lg bg-base-200 mx-auto">
      <form className="space-y-6 p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-primary text-center">Login</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Username</span>
          </label>
          <input
            type="text"
            className="input input-bordered border-primary text-primary"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered border-primary text-primary"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-secondary w-full hover:bg-secondary-focus active:bg-secondary-content transition duration-200"
          onClick={handleLogin}
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;
