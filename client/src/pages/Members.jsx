import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEye, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import MembershipInformationModal from "../components/modal/MemberProfileModal";
import AddMemberModal from "../components/modal/AddMemberModal";

const Members = () => {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch members function to be reused
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = searchTerm ? { name: searchTerm } : {};
      const response = await axios.get("http://localhost:3001/api/members", { params });
      setMembers(response.data);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members on mount and when searchTerm changes
  useEffect(() => {
    fetchMembers();
  }, [searchTerm]);

  // Open Add/Edit modal
  const openAddEditModal = (member) => {
    setSelectedMember(member);
    setIsAddEditModalOpen(true);
    setSuccessMessage(""); // Reset success message when opening modal
    setErrorMessage("");   // Reset error message when opening modal
  };

  // Open View modal
  const openViewModal = (member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsAddEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedMember(null);
  };

  const handleSave = async (updatedMember) => {
    closeModals();
    setSuccessMessage(""); // Reset success message
    setErrorMessage("");   // Reset error message
    try {
      if (updatedMember.id) {
        // If the member has an ID, we are updating
        await axios.put(`http://localhost:3001/api/members/${updatedMember.id}`, updatedMember);
        setSuccessMessage("Member added successfully!"); // Success message for update
      }
      fetchMembers(); // Re-fetch the members list after saving
    } catch (error) {
      console.error("Error saving member:", error);
      setErrorMessage(error.response?.data?.message || "Error saving member"); // Error message
    }
  };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this member?");
  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:3001/api/members/${id}`);
      
      setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
      
      setSuccessMessage("Member deleted successfully!");
      setErrorMessage(""); 
    } catch (error) {
      console.error("Error deleting member:", error);
      setErrorMessage("Error deleting member"); 
    }
  }
};


  const filteredMembers = members.filter((member) =>
    member.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error fetching data: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Member List</h2>


      <div className="mb-4 flex justify-end">
      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
        <div className="relative w-80 mr-4">
          <input
            type="text"
            placeholder="Search member..."
            className="px-10 py-2 border border-gray-300 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          className="px-4 py-3 bg-green-500 text-white rounded hover:bg-green-700 flex items-center space-x-2"
          onClick={() => openAddEditModal(null)}
        >
          <FaPlus />
          <span>Add Member</span>
        </button>
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: "70vh" }}>
        <table className="min-w-full table-auto bg-white border border-gray-300 text-sm">
          <thead className="sticky top-0 bg-green-200 z-20 text-center">
            <tr>
              {["Member Code", "Full Name", "Age", "Gender", "Contact Number", "Address", "Shared Capital", "Action"].map((heading) => (
                <th key={heading} className="py-3 px-4 border-b border-gray-300 text-center">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="text-center hover:bg-gray-100 cursor-pointer">
                {/* <td className="py-3 px-4 border-b border-gray-300 text-sm">{member.id}</td> */}
                <td className="py-3 px-4 border-b border-gray-300 text-sm">{member.memberCode}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm">{member.fullName}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm">{member.age}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm">{member.gender}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm">{member.contactNumber}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm">{member.address}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm">{member.sharedCapital}</td>
                <td className="py-3 px-4 border-b border-gray-300">
                  <div className="flex justify-center space-x-1">
                    <button
                      onClick={() => openAddEditModal(member)}
                      className="w-20 bg-orange-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:bg-orange-600 min-h-[40px]"
                    >
                      <FaEdit />
                      <span className="ml-1">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="w-20 bg-red-500 text-white py-3 rounded-md flex items-center justify-center hover:bg-red-600 min-h-[40px]"
                    >
                      <FaTrash />
                      <span className="ml-1">Delete</span>
                    </button>
                    <button
                      onClick={() => openViewModal(member)}
                      className="w-20 bg-blue-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:bg-blue-600 min-h-[40px]"
                    >
                      <FaEye />
                      <span className="ml-1">View</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddEditModalOpen && (
        <AddMemberModal
          isOpen={isAddEditModalOpen}
          onClose={closeModals}
          onSave={handleSave} // Refetch members after saving
          memberIdToEdit={selectedMember?.id} // Updated to use id
        />
      )}

      {isViewModalOpen && (
        <MembershipInformationModal
          isOpen={isViewModalOpen}
          onClose={closeModals}
          member={selectedMember} // Pass selected member to the modal for viewing
        />
      )}
    </div>
  );
};

export default Members;
