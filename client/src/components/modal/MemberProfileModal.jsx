import React from "react";
import pic from "../blankPicture.png"; // Fallback placeholder image

const MembershipInformationModal = ({ member, onClose }) => {
    if (!member) return null;

    const memberSinceDate = new Date(member.memberSince);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = memberSinceDate.toLocaleDateString('en-US', options);

    const idPictureUrl = member.idPicture ? `http://localhost:3001/uploads/${member.idPicture}` : pic;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg overflow-auto">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-red-500 text-2xl font-bold">
                        &times;
                    </button>
                </div>

                <div className="flex items-start space-x-6">
                    <div className="text-center">
                        <img
                            src={idPictureUrl}  
                            alt="ID Picture"
                            className="w-32 h-32 rounded-full object-cover mx-auto"
                        />
                        <h3 className="text-2xl font-bold mt-4">{member.fullName}</h3>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-4">Member Information</h2>
                        <div className="grid grid-cols-2">
                            <div className="mr-4">
                                <p className="text-gray-700">
                                    <span className="font-bold">Membership ID:</span> {member.memberId}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-bold">Member since:</span> {formattedDate}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-bold">Age:</span> {member.age}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-700">
                                    <span className="font-bold">Gender:</span> {member.gender}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-bold">Contact No:</span> {member.contactNumber}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-bold">Address:</span> {member.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-solid border-gray-400 my-4" />
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Financial Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-bold">Shared Capital:</p>
                            <p>{member.sharedCapital}</p>
                        </div>
                        <div>
                            <p className="font-bold">Savings:</p>
                            <p>{member.savings}</p>
                        </div>
                        <div>
                            <p className="font-bold">Loan Limit:</p>
                            <p>{member.loanLimit}</p>
                        </div>
                        <div>
                            <p className="font-bold">Dividend:</p>
                            <p>{member.dividend}</p>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-solid border-gray-400 my-4" />
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Account Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-bold">Email:</p>
                            <p>{member.email}</p>
                        </div>
                        <div>
                            <p className="font-bold">Password:</p>
                            <p>{member.password}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipInformationModal;
