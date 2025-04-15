import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import { $api } from "../api/client";

const isLoggedIn = () => {
  return localStorage.getItem("jwt") !== null;
};

const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isError } = $api.useQuery(
    "get",
    "/api/v1/auth/users/me",
    {},
    { enabled: isLoggedIn(),
        retry: false,
     },
  );

  const user = isError ? undefined : data;

  const signUpMutation = $api.useMutation(
    "post",
    "/api/v1/auth/signup",
    {
        onSuccess: () => {
            navigate("/login")
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/v1/auth/users/me"] });
        }
    }
  )

  const loginMutation = $api.useMutation(
    "post",
    "/api/v1/auth/access-token",
    {
      onSuccess: (data) => {
        localStorage.setItem("jwt", data.access_token);
        navigate("/")
      },
      onError: (err) => {
        console.log(err)
      },
    }
  )

  const logout = async () => {
    localStorage.removeItem("jwt");
    await queryClient.invalidateQueries({ queryKey: ["get", "/api/v1/auth/users/me", {}] });
    navigate("/");
  };

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    error,
    resetError: () => setError(null),
  };
};

export { isLoggedIn };
export default useAuth;
