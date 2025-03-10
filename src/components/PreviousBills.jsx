// src/components/PreviousBills.jsx
import React, { useState, useEffect } from 'react';

function PreviousBills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const storedBills = JSON.parse(localStorage.getItem('bills')) || [];
    setBills(storedBills);
  }, []);

  // (Optional) Function to delete a bill
  // const deleteBill = (billIndex) => { 
  //   // Logic to delete the bill from localStorage
  // };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Previous Bills</h2>
      {bills.length === 0 ? (
        <p>No previous bills found.</p> 
      ) : (
        <div className="overflow-x-auto"> 
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Invoice No.</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Customer Name</th>
                {/* Add more columns as needed (e.g., Total Amount) */}
                <th className="py-2 px-4 border-b text-left">Actions</th> 
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{bill.invoiceNumber}</td> 
                  <td className="py-2 px-4 border-b">{bill.date}</td> 
                  <td className="py-2 px-4 border-b">{bill.customerName}</td> 
                  {/* Display other relevant bill data */}
                  <td className="py-2 px-4 border-b"> 
                    <button 
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                      // onClick={() => { /* Logic to view the bill (e.g., in a modal) */ }}
                    >
                      View
                    </button>
                    {/* (Optional) Add Print and Delete buttons */} 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PreviousBills;
