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
  const [beneficiaries, setBeneficiaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = searchTerm ? { name: searchTerm } : {};
      const response = await axios.get("http://localhost:3001/api/members", { params });
      setMembers(response.data);
      setError(null); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error fetching members.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMembers();
  }, [searchTerm,]);

  const openAddEditModal = (member) => {
    setSelectedMember(member);
    setIsAddEditModalOpen(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const openViewModal = (member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const closeModals = () => {
    setIsAddEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedMember(null);
  };

  const handleSave = async (updatedMember) => {
    closeModals();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (updatedMember.id) {
        // Update member
        await axios.put(`http://localhost:3001/api/members/${updatedMember.id}`, updatedMember);
        setSuccessMessage("Member updated successfully!");
      } else {
        // Add new member
        await axios.post("http://localhost:3001/api/members", updatedMember);
        setSuccessMessage("Member added successfully!");
      }
      fetchMembers();
    } catch (error) {
      console.error("Error saving member:", error);
      setErrorMessage(error.response?.data?.message || "Error saving member.");
    }
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        // Delete the member from the server
        await axios.delete(`http://localhost:3001/api/members/${memberId}`);
    
        // Update the local state by removing the deleted member
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberId) // Use member.id here
        );
    
        setSuccessMessage("Member deleted successfully!");
        setErrorMessage("");
        fetchMembers()
      } catch (error) {
        console.error("Error deleting member:", error);
        setErrorMessage("Error deleting member.");
      }
    }
  };
  

  // const filteredMembers = members.filter((member) =>
  //   member.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error fetching data: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Member List</h2>
      <div className="mb-4 flex justify-between">
        <div>
          {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
          {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
        </div>
        <div className="flex items-center">
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
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: "70vh" }}>
        <table className="min-w-full table-auto bg-white border border-gray-300 text-sm">
          <thead className="sticky top-0 bg-green-200 z-20 text-center">
            <tr>
              {["Member Code", "Last Name", "First Name", "Contact Number", "Address", "Shared Capital", "Actions"].map((headings) => (
                <th key={headings} className="py-3 px-4 border-b border-gray-300">
                  {headings}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="text-center hover:bg-gray-100 cursor-pointer">
                <td className="py-3 px-4 border-b border-gray-300">{member.memberCode}</td>
                <td className="py-3 px-4 border-b border-gray-300">{member.fullNameLastName}</td>
                <td className="py-3 px-4 border-b border-gray-300">{member.fullNameFirstName}</td>
                <td className="py-3 px-4 border-b border-gray-300">{member.contactNumber}</td>
                <td className="py-3 px-4 border-b border-gray-300">{member.barangay}</td>
                <td className="py-3 px-4 border-b border-gray-300">{member.shareCapital}</td>
                <td className="py-3 px-4 border-b border-gray-300">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => openAddEditModal(member)}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(member.memberId)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => openViewModal(member)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      <FaEye /> View
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
          onSave={handleSave}
          memberIdToEdit={selectedMember?.id}
        />
      )}
      {isViewModalOpen && (
        <MembershipInformationModal
          isOpen={isViewModalOpen}
          onClose={closeModals}
          member={selectedMember}
        />
      )}
    </div>
  );
};

export default Members;
