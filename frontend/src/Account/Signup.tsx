import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

function Signup() {
  const navigate = useNavigate();
  const { signUpMutation } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await signUpMutation.mutateAsync({
      body: { email: formData.email, password: formData.password },
    });
  };

  return (
    <div className="max-w-lg w-1/4 min-w-[300px] mt-20 rounded-xl shadow-lg bg-base-200 mx-auto">
      <form className="space-y-6 p-6 sm:p-10" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold text-primary text-center">Sign Up</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Email</span>
          </label>
          <input
            type="email"
            name="email"
            className="input input-bordered border-primary text-primary"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Password</span>
          </label>
          <input
            type="password"
            name="password"
            className="input input-bordered border-primary text-primary"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Confirm Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="input input-bordered border-primary text-primary"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-secondary w-full hover:bg-secondary-focus active:bg-secondary-content transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
