import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import requests from "../config";
import Sidebar from "../components/SideBar";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader spinner

const CommitteeDetail = () => {
  const { id } = useParams();
  const [committeeDetails, setCommitteeDetails] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [role, setRole] = useState("principal");
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${requests.BaseUrlCommittee}/committee-detail/${id}/`);
        setCommitteeDetails(response.data);
      } catch (error) {
        console.error("Error fetching committee details:", error);
      } finally {
        setTimeout(() => setLoading(false), 1500); // Minimum delay for loading spinner
      }
    };
    
    fetchData();
  }, [id]);

  const handleAdd = () => {
    navigate(`/add-members/${id}`);
  };

  const handleAlert = (committeeDetailId) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this employee?");
    if (isConfirmed) deleteEmployee(committeeDetailId);
  };

  const deleteEmployee = (committeeDetailId) => {
    fetch(`${requests.BaseUrlCommittee}/committee-detail/${committeeDetailId}/delete/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        alert("Employee removed successfully!");
        window.location.reload();
      } else {
        alert("Failed to remove employee. Please try again.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
  };

  const handleGeneratePDF = (receiverName, role) => {
    axios
      .get(`${requests.BaseUrlCommittee}/report/${id}/`, {
        params: { receiver_name: receiverName, role: role },
        responseType: "text"
      })
      .then((response) => {
        const reportHtml = response.data;
        const printWindow = window.open("", "_blank");
        printWindow.document.open();
        printWindow.document.write(reportHtml);
        printWindow.document.close();
        printWindow.onload = () => printWindow.print();
      })
      .catch((error) => {
        console.error("Error generating HTML report:", error);
      });
  };

  const handleSubmit = async () => {
    handleGeneratePDF(receiverName, role);
    toggleModal();
  };

  const handleAddSubCommittee = () => navigate(`/add-subcommittee/${id}`);
  
  const handleReconstitute = (mode) => navigate(`/committee?committeeId=${id}&mode=${mode}`);
  
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-100">
        <ClipLoader color="#6366F1" size={100} /> {/* Large spinner */}
      </div>
    );
  }

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900 text-gray-100">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow pt-10 pb-8 px-6 lg:px-10">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-5xl font-semibold text-blue-300 mb-4">Committee Details</h2>
          <h3 className="text-4xl font-bold text-gray-100 bg-gray-800 px-8 py-4 rounded-lg shadow-lg">
            {committeeDetails.committe_Name}
          </h3>
        </div>

        <div className="bg-gray-800 text-gray-300 p-8 rounded-lg shadow-md mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-blue-200">Order Description</h4>
              <p className="text-md">{committeeDetails.order_Description}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-200">Order Number</h4>
              <p className="text-md">{committeeDetails.order_number}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-200">Order Text</h4>
              <p className="text-md">{committeeDetails.order_Text}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-200">Order Date</h4>
              <p className="text-md">{new Date(committeeDetails.order_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-200">Committee Expiry</h4>
              <p className="text-md">{committeeDetails.committe_Expiry ? "Active" : "Expired"}</p>
            </div>
          </div>
          <button
            className="mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
            onClick={() => handleReconstitute("edit")}
          >
            Edit
          </button>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 space-y-6 mb-10 border-2 border-blue-500">
          <h3 className="text-2xl font-bold text-white">Main Committee Members</h3>
          <ul className="list-disc pl-5 text-gray-300 space-y-2">
            {(committeeDetails.main_committee_members || []).map((member, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-white font-semibold">{member.employee?.name} - {member.role}</span>
                <button
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-1 px-3 rounded-md"
                  onClick={() => handleAlert(member.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
            onClick={handleAdd}
          >
            Add More Members
          </button>
        </div>

        {committeeDetails.sub_committees?.length > 0 && (
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
            <h4 className="text-2xl font-bold text-blue-300 border-b-2 border-blue-500 pb-2">Subcommittees</h4>
            {committeeDetails.sub_committees.map((subCommittee, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-6 shadow-md">
                <h5 className="text-lg font-semibold text-white">{subCommittee.sub_committee_name}</h5>
                <p className="text-gray-300 mb-4">{subCommittee.sub_committee_Text}</p>
                <ul className="list-disc pl-5 text-gray-300">
                  {(subCommittee.members || []).map((member, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-gray-200 font-semibold">{member.employee?.name}</span>
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-1 px-3 rounded-md"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center space-y-4 mt-10">
          <button
            onClick={handleAddSubCommittee}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-150"
          >
            Add Subcommittee
          </button>
          <button
            onClick={() => handleReconstitute("reconstitute")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-150"
          >
            Reconstitute Committee
          </button>
          <button
            onClick={toggleModal}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-2 px-6 rounded-lg shadow-lg transition duration-150"
          >
            Generate Report
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-gray-200 p-6 rounded-lg shadow-lg w-full max-w-lg mx-4">
              <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold">Receiver Name:</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Role:</label>
                  <select
                    className="w-full mt-1 p-2 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="principal">Principal</option>
                    <option value="dean">Dean</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={toggleModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-md transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded-md transition duration-150"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeDetail;
