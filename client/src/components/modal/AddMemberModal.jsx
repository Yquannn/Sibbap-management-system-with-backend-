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
    password: '',
    idPicture: null,
    applicationForm: null,
    barangayClearance: null,
    tin: null,
    pmes: null,
  });

  const [message, setMessage] = useState('');
  const { id } = useParams();

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
          password: response.data.password,
          idPicture: response.data.idPicture ,
          applicationForm: null,
          barangayClearance: null,
          tin: null,
          pmes: null,
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
      resetForm();
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
      password: '',
      idPicture: null,
      applicationForm: null,
      barangayClearance: null,
      tin: null,
      pmes: null,
    });
    setMessage('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewMember({
      ...newMember,
      [name]: files[0], 
    });
  };

  const handleAddOrEditMember = async (e) => {
    e.preventDefault();

    if (!newMember.fullName || !newMember.email) {
      setMessage('Full Name and Email are required.');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', newMember.fullName);
    formData.append('age', newMember.age);
    formData.append('contactNumber', newMember.contactNumber);
    formData.append('gender', newMember.gender);
    formData.append('address', newMember.address);
    formData.append('sharedCapital', newMember.sharedCapital);
    formData.append('email', newMember.email);
    formData.append('password', newMember.password);
    if (newMember.idPicture) {
      formData.append('idPicture', newMember.idPicture);
    }
    if (newMember.applicationForm) {
      formData.append('applicationForm', newMember.applicationForm);
    }
    if (newMember.barangayClearance) {
      formData.append('barangayClearance', newMember.barangayClearance);
    }
    if (newMember.tin) {
      formData.append('tin', newMember.tin);
    }
    if (newMember.pmes) {
      formData.append('pmes', newMember.pmes);
    }

    try {
      const response = await axios[memberIdToEdit ? 'put' : 'post'](
        `http://localhost:3001/api/members${memberIdToEdit ? `/${memberIdToEdit}` : ''}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMessage(response.data.message || 'Member data saved successfully!');
      onSave(newMember);
      resetForm();
    } catch (error) {
      console.error("Error adding or updating member:", error);
      if (error.response) {
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative z-10 max-h-[80vh] overflow-auto">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-red-500 text-2xl font-bold">&times;</button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">MEMBER MANAGEMENT</h1>
        {message && <p className="text-red-500">{message}</p>}
        <h2 className="text-lg font-semibold mt-4 mb-2">{memberIdToEdit ? 'EDIT MEMBER' : 'ADD NEW MEMBER'}</h2>
        <form onSubmit={handleAddOrEditMember}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
              ) : key !== 'applicationForm' && key !== 'barangayClearance' && key !== 'tin' && key !== 'pmes' ? (
                <div key={key}>
                  <label className="block text-gray-700">{key.toUpperCase()}:</label>
                  <input
                    type={key === 'password' ? 'password' : key === 'sharedCapital' ? 'number' : 'text'}
                    value={newMember[key]}
                    onChange={(e) => setNewMember({ 
                      ...newMember, 
                      [key]: (key === 'email' || key === 'password') ? e.target.value : e.target.value.toUpperCase()
                    })}
                    required
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              ) : null
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Required Documents</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <label className="block text-gray-700">APPLICATION FORM:</label>
                <input type="file" id="applicationForm" name="applicationForm" onChange={handleFileChange} className="w-full" />
              </div>
              <div>
                <label className="block text-gray-700" >ID PICTURE (1X1 AND 2X2):</label>
                {newMember.idPicture && (
                  <a 
                    href={`http://localhost:3001/uploads/${newMember.idPicture}`} 
                    target="_blank" 
                    className="text-blue-500 underline"
                  >
                    View ID Picture
                  </a>
                )}
                <input type="file" id="idPicture" name="idPicture" onChange={handleFileChange} className="w-full mt-1" />
              </div>
              <div>
                <label className="block text-gray-700">BARANGAY CLEARANCE:</label>
                <input type="file" id="barangayClearance" name="barangayClearance" onChange={handleFileChange} className="w-full" />
              </div>
              <div>
                <label className="block text-gray-700">TIN:</label>
                <input type="file" id="tin" name="tin" onChange={handleFileChange} className="w-full" />
              </div>
              <div>
                <label className="block text-gray-700">PMES:</label>
                <input type="file" id="pmes" name="pmes" onChange={handleFileChange} className="w-full" />
              </div>
            </div>
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
