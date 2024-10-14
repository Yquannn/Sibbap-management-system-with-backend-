import React, { useState } from "react";
import { FaPlus, FaEye, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import AddUserModal from "../components/modal/AddUserModal"; 
import UserInformationModal from "../components/modal/MemberProfileModal";

const Users = () => {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      userId: "210831",
      fullName: "John Doe",
      age: 30,
      gender: "Male",
      contact: "123-456-7890",
      address: "Tabangao",
      userType: "General Manager",
      email: "johndoe@gmail.com",
      password: "password123",
    },
    {
      userId: "210832",
      fullName: "Jane Smith",
      age: 28,
      gender: "Female",
      contact: "098-765-4321",
      address: "Batangas",
      userType: "Teller",
      email: "janesmith@gmail.com",
      password: "password456",
    },
    {
      userId: "03218",
      fullName: "Yquan Smith",
      age: 21,
      gender: "Male",
      contact: "098-765-4321",
      address: "Lipa",
      userType: "Teller",
      email: "yquansmith@gmail.com",
      password: "password789",
    },
    {
      userId: "03219",
      fullName: "Ian Mendoza",
      age: 22,
      gender: "Male",
      contact: "098-765-4322",
      address: "Lipa",
      userType: "Teller",
      email: "ianmendoza@gmail.com",
      password: "password321",
    },
  ];

  const openAddEditModal = (user) => {
    setSelectedUser(user);
    setIsAddEditModalOpen(true);
  };

  const closeModals = () => {
    setIsAddEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = (updatedUser) => {
    console.log("User saved:", updatedUser);
    closeModals();
  };

  const handleDelete = (index) => {
    console.log("Delete user at index:", index);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">User List</h2>
      <div className="mb-4 flex justify-end">
        <div className="relative w-80 mr-4">
          <input
            type="text"
            placeholder="Search user ..."
            className="px-10 py-2 border border-gray-300 rounded-md w-full"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center space-x-2"
          onClick={() => openAddEditModal(null)}
        >
          <FaPlus />
          <span>Add User</span>
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-green-200">
            <th className="py-2 px-4 border-b border-gray-300">User Name</th>
            <th className="py-2 px-4 border-b border-gray-300">Age</th>
            <th className="py-2 px-4 border-b border-gray-300">Gender</th>
            <th className="py-2 px-4 border-b border-gray-300">Contact Number</th>
            <th className="py-2 px-4 border-b border-gray-300">Address</th>
            <th className="py-2 px-4 border-b border-gray-300">User type</th>
            <th className="py-2 px-4 border-b border-gray-300">Email</th>
            <th className="py-2 px-4 border-b border-gray-300">Password</th>
            <th className="py-2 px-4 border-b border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b border-gray-300">{user.fullName}</td>
              <td className="py-2 px-4 border-b border-gray-300">{user.age}</td>
              <td className="py-2 px-4 border-b border-gray-300">{user.gender}</td>
              <td className="py-2 px-4 border-b border-gray-300">{user.contact}</td>
              <td className="py-2 px-4 border-b border-gray-300">{user.address}</td>
              <td className="py-2 px-4 border-b border-gray-300">{user.userType}</td>
              <td className="py-2 px-4 border-b border-gray-300">{user.email}</td>
              <td className="py-2 px-4 border-b border-gray-300">{user.password}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                <div className="flex justify-center">
                  <button
                    onClick={() => openAddEditModal(user)}
                    className="hover:underline bg-orange-500 text-white pl-4 pr-4 py-2 rounded-md flex items-center space-x-2"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="hover:underline bg-red-500 text-white pl-4 pr-4 py-2 rounded-md flex items-center space-x-2 ml-2"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddEditModalOpen && (
        <AddUserModal
          member={selectedUser} // Pass the selected user data
          onClose={closeModals}
          onSave={handleSave}
        />
      )}

      {isViewModalOpen && (
        <UserInformationModal
          user={selectedUser}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

export default Users;
