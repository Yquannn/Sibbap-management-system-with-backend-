import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddMemberModal = ({ isOpen, onClose, onSave, memberIdToEdit }) => {
  const [newMember, setNewMember] = useState({
    fullName: '',
    age: '',
    contactNumber: '',
    gender: '',
    address: '',
    sharedCapital: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const { id } = useParams(); // Assuming 'id' is being used for some purpose

  const fetchMemberData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/members/${id}`);
      if (response.data) {
        setNewMember({
          fullName: response.data.fullName,
          age: response.data.age,
          contactNumber: response.data.contactNumber,
          gender: response.data.gender,
          address: response.data.address,
          sharedCapital: response.data.sharedCapital,
          email: response.data.email,
          password: response.data.password
        });
      } else {
        setMessage('No member data found.');
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      setMessage('Error fetching member data. Please try again later.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (memberIdToEdit) {
        fetchMemberData(memberIdToEdit);
      } else {
        resetForm();
      }
    } else {
      resetForm(); // Reset form when modal closes
    }
  }, [isOpen, memberIdToEdit]);

  const resetForm = () => {
    setNewMember({
      fullName: '',
      age: '',
      contactNumber: '',
      gender: '',
      address: '',
      sharedCapital: '',
      email: '',
      password: ''
    });
    setMessage(''); // Clear any previous messages
  };

  const handleAddOrEditMember = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newMember.fullName || !newMember.email) {
      setMessage('Full Name and Email are required.');
      return;
    }

    const memberData = {
      ...newMember,
      memberSince: new Date().toISOString().split('T')[0],
      sharedCapital: Number(newMember.sharedCapital)
    };

    // Ensure fields are properly formatted
    Object.keys(memberData).forEach(key => {
      if (typeof memberData[key] === 'string') {
        memberData[key] = key === 'sharedCapital' ? memberData[key] : memberData[key].toUpperCase();
      }
    });

    try {
      const response = await axios[memberIdToEdit ? 'put' : 'post'](
        `http://localhost:3001/api/members${memberIdToEdit ? `/${memberIdToEdit}` : ''}`,
        memberData
      );

      // Log the full response for debugging
      console.log("Response from server:", response);

      setMessage(response.data.message || 'Member data saved successfully!');
      onSave(memberData); // Call the onSave prop with the new member data
      resetForm();
    } catch (error) {
      // Enhanced error logging
      console.error("Error adding or updating member:", error);
      
      // Check if there's a response and log it
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        setMessage(`Error: ${error.response.data.message || 'An error occurred. Please try again later.'}`);
      } else {
        setMessage('Error adding or updating member. Please try again later.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" />
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative z-10">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-red-500 text-2xl font-bold">&times;</button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">MEMBER MANAGEMENT</h1>
        {message && <p className="text-red-500">{message}</p>}
        <h2 className="text-lg font-semibold mt-6 mb-2">{memberIdToEdit ? 'EDIT MEMBER' : 'ADD NEW MEMBER'}</h2>
        <form onSubmit={handleAddOrEditMember}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {Object.keys(newMember).map((key) => (
              key === 'gender' ? (
                <div key={key}>
                  <label className="block text-gray-700">{key.toUpperCase()}:</label>
                  <select 
                    value={newMember[key]} 
                    onChange={(e) => setNewMember({ ...newMember, [key]: e.target.value })} 
                    required 
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              ) : (
                <div key={key}>
                  <label className="block text-gray-700">{key.toUpperCase()}:</label>
                  <input
                    type={key === 'password' ? 'password' : key === 'sharedCapital' ? 'number' : 'text'}
                    value={newMember[key]}
                    onChange={(e) => setNewMember({ ...newMember, [key]: e.target.value })}
                    required
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              )
            ))}
          </div>
          <button type="submit" className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            {memberIdToEdit ? 'UPDATE MEMBER' : 'ADD MEMBER'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
