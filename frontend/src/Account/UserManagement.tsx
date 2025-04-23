import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { $api } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

function UserManagement() {

  const { data: users} = $api.useQuery("get", "/api/v1/user/")
  const queryClient = useQueryClient()

  const userMutatation = $api.useMutation("delete", "/api/v1/user/{user_id}", {
    onSuccess: () => {
      // Invalidate the query to refetch the user list
      queryClient.invalidateQueries({queryKey: [
    "get", "/api/v1/user/"
      ]}
    )},
  })


  const handleDelete = async (userId) => {
    try {
      await userMutatation.mutateAsync({
        params: {
            path: {
                user_id: userId
            }
        }
      })
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;