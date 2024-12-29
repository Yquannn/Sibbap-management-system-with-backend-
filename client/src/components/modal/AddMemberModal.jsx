import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Success from '../Success';

const AddMemberModal = ({ isOpen, onClose, onSave, memberIdToEdit }) => {
  const [newMember, setNewMember] = useState({
    registrationType: '', memberType: '', registrationDate: '', shareCapital: '',
    fullNameLastName: '', fullNameFirstName: '', fullNameMiddleName: '', maidenName: '',
    tinNumber: '', dateOfBirth: '', birthplaceProvince: '', age: '', sex: '', civilStatus: '',
    highestEducationalAttainment: '', occupationSourceOfIncome: '', spouseName: '',
    spouseOccupationSourceOfIncome: '', primaryBeneficiaryName: '', primaryBeneficiaryRelationship: '', primaryBeneficiaryContact: '',
    secondaryBeneficiaryName: '', secondaryBeneficiaryRelationship: '', secondaryBeneficiaryContact: '', contactNumber: '',
    houseNoStreet: '', barangay: '', city: '', referenceName: '', position: '', referenceContact: '', email: '', password: '',
    idPicture: null
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const { id } = useParams();

  const fetchMemberData = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:3001/api/members/${id}`);
      data ? setNewMember(data) : setMessage('No member data found.');
    } catch (error) {
      console.error("Error fetching member data:", error);
      setMessage('Error fetching member data. Please try again later.');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isOpen && memberIdToEdit) {
        fetchMemberData(memberIdToEdit);
      }
    }, 5000);
  
    return () => clearInterval(intervalId); 
  }, [isOpen, memberIdToEdit]);
  

  const resetForm = () => {
    setNewMember({
      registrationType: '', memberType: '', registrationDate: '', shareCapital: '',
      fullNameLastName: '', fullNameFirstName: '', fullNameMiddleName: '', maidenName: '',
      tinNumber: '', dateOfBirth: '', birthplaceProvince: '', age: '', sex: '', civilStatus: '',
      highestEducationalAttainment: '', occupationSourceOfIncome: '', spouseName: '',
      spouseOccupationSourceOfIncome: '', primaryBeneficiaryName: '', primaryBeneficiaryRelationship: '', primaryBeneficiaryContact: '',
      secondaryBeneficiaryName: '', secondaryBeneficiaryRelationship: '', secondaryBeneficiaryContact: '', contactNumber: '',
      houseNoStreet: '', barangay: '', city: '', referenceName: '', position: '', referenceContact: '', email: '', password: '',
      idPicture: null
    });
    setMessage('');
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setNewMember(prevState => ({
      ...prevState,
      [fieldName]: file
    }));
  };


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOrEditMember  = async (event) => {
    event.preventDefault();
  
    if (isSubmitting) return; 
    setIsSubmitting(true);
  
    const formData = new FormData();
    Object.keys(newMember).forEach((key) => {
      if (newMember[key]) {
        formData.append(key, newMember[key]);
      }
    });
  
    try {
      const response = await axios.post('http://localhost:3001/api/members', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message || 'Member added successfully!');
      resetForm()
      onClose()
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false); 
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

        <h2 className="text-lg font-semibold mt-4 mb-2">MEMBER’S TYPE REGISTRATION</h2>
        <label className="block text-gray-700">Registration Type:</label>
        <select value={newMember.registrationType} onChange={(e) => setNewMember({ ...newMember, registrationType: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full">
          <option value="">Select Type</option>
          <option value="New">New</option>
          <option value="Transfer">Transfer</option>
          <option value="Regular Member">Regular Member</option>
          <option value="Associate Member">Associate Member</option>
        </select>

        <label className="block text-gray-700 mt-4">Member Type:</label>
        <select value={newMember.memberType} onChange={(e) => setNewMember({ ...newMember, memberType: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full">
          <option value="">Select Member Type</option>
          <option value="Individual">Individual</option>
          <option value="Corporate">Corporate</option>
        </select>

        <label className="block text-gray-700 mt-4">Date of Registration:</label>
        <input type="date" value={newMember.registrationDate} onChange={(e) => setNewMember({ ...newMember, registrationDate: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />

        <label className="block text-gray-700 mt-4">Share Capital:</label>
        <input type="number" value={newMember.shareCapital} onChange={(e) => setNewMember({ ...newMember, shareCapital: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />

        <h2 className="text-lg font-semibold mt-4 mb-2">PERSONAL INFORMATION</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <label className="block text-gray-700">Full Name:</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={newMember.fullNameLastName} onChange={(e) => setNewMember({ ...newMember, fullNameLastName: e.target.value })} placeholder="Last Name" className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
              <input type="text" value={newMember.fullNameFirstName} onChange={(e) => setNewMember({ ...newMember, fullNameFirstName: e.target.value })} placeholder="First Name" className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
              <input type="text" value={newMember.fullNameMiddleName} onChange={(e) => setNewMember({ ...newMember, fullNameMiddleName: e.target.value })} placeholder="Middle Name" className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
            </div>
          </div>

          {['maidenName', 'tinNumber', 'dateOfBirth', 'birthplaceProvince', 'age', 'sex', 'civilStatus', 'highestEducationalAttainment', 'occupationSourceOfIncome', 'spouseName', 'spouseOccupationSourceOfIncome'].map((field, idx) => (
            <div key={idx}>
              <label className="block text-gray-700">{field.replace(/([A-Z])/g, ' $1')}:</label>
              <input type={field === 'dateOfBirth' ? 'date' : 'text'} value={newMember[field]} onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold mt-4 mb-2">Contact Information</h2>
        {['contactNumber', 'houseNoStreet', 'barangay', 'city'].map((field, idx) => (
          <div key={idx}>
            <label className="block text-gray-700">{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input type="text" value={newMember[field]} onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
        ))}

        <h2 className="text-lg font-semibold mt-4 mb-2">Legal Beneficiaries</h2>
        {['primaryBeneficiaryName', 'primaryBeneficiaryRelationship', 'primaryBeneficiaryContact', 'secondaryBeneficiaryName', 'secondaryBeneficiaryRelationship', 'secondaryBeneficiaryContact'].map((field, idx) => (
          <div key={idx}>
            <label className="block text-gray-700">{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input type="text" value={newMember[field]} onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
        ))}

        <h2 className="text-lg font-semibold mt-4 mb-2">Character References</h2>
        {['referenceName', 'position', 'referenceContact'].map((field, idx) => (
          <div key={idx}>
            <label className="block text-gray-700">{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input type="text" value={newMember[field]} onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
        ))}

        <h2 className="text-lg font-semibold mt-4 mb-2">Account Information</h2>
        <div>
          <label className="block text-gray-700">Email:</label>
          <input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>

        <div>
          <label className="block text-gray-700">Password:</label>
          <input type="password" value={newMember.password} onChange={(e) => setNewMember({ ...newMember, password: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Upload ID Picture:</label>
          <input type="file" onChange={(e) => handleFileChange(e, 'idPicture')} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={onClose}>Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddOrEditMember}>Save</button>      
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
