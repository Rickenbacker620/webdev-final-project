import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { $api } from "../api/client";
import useAuth from "../hooks/useAuth";

function Settings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    description: user?.description || "",
    password: "",
  });

  const updateUserMutation = $api.useMutation("put", "/api/v1/user/me", {
    onSuccess: () => {
      alert("Profile updated successfully!");
    },
    onError: (error) => {
        console.error(error);
        alert("Failed to update profile.");
    },
  }
 )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUserMutation.mutateAsync({
            body: {
            email: formData.email,
            description: formData.description,
            password: formData.password,
            },
    })
  };

  return (
    <div className="max-w-lg w-1/4 min-w-[300px] mt-20 rounded-xl shadow-lg bg-base-200 mx-auto p-6">
      <h2 className="text-2xl font-bold text-primary text-center">Settings</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
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
            <span className="label-text text-primary">Description</span>
          </label>
          <textarea
            name="description"
            className="textarea textarea-bordered border-primary text-primary"
            placeholder="Enter your description"
            value={formData.description}
            onChange={handleInputChange}
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
            placeholder="Enter a new password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Settings;