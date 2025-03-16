// src/components/PreviousBills.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { formatIndianCurrency } from '../utils/currencyFormatter.js'; // Assuming you have this utility

Modal.setAppElement('#root'); 

function PreviousBills() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null); 

  useEffect(() => {
    const storedBills = JSON.parse(localStorage.getItem('bills')) || [];
    setBills(storedBills);
  }, []);

  const deleteBill = (billIndex) => {
    const updatedBills = [...bills];
    updatedBills.splice(billIndex, 1);
    setBills(updatedBills);
    localStorage.setItem('bills', JSON.stringify(updatedBills));
  };

  const openModal = (bill) => {
    setSelectedBill(bill);
  };

  const closeModal = () => {
    setSelectedBill(null);
  };

  // Function to handle printing a specific bill
  const handlePrintBill = (bill) => {
    setSelectedBill(bill);
    setTimeout(() => {
      window.print(); 
      setSelectedBill(null); 
    }, 0);
  };

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
                <th className="py-2 px-4 border-b text-left">Total Amount</th> {/* Added Total Amount column */}
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{bill.invoiceNumber}</td>
                  <td className="py-2 px-4 border-b">{bill.date}</td>
                  <td className="py-2 px-4 border-b">{bill.customerName}</td>
                  <td className="py-2 px-4 border-b">₹{formatIndianCurrency(bill.grandTotal)}</td> {/* Display Total Amount */}
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs mr-2"
                      onClick={() => openModal(bill)} 
                    >
                      View
                    </button>
                    <button 
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs mr-2"
                      onClick={() => handlePrintBill(bill)}
                    >
                      Print
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                      onClick={() => deleteBill(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Bill Details */}
      <Modal 
        isOpen={Boolean(selectedBill)}
        onRequestClose={closeModal}
        contentLabel="Bill Details"
        className="modal" 
      > 
        <div className="print:hidden">
          <button onClick={closeModal} className="absolute top-2 right-2">
            Close 
          </button>
        </div>
        {selectedBill && ( 
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Invoice No. {selectedBill.invoiceNumber}</h3>
            {/* ... other bill details you want to display ... */}
            <p><span className="font-bold">Date:</span> {selectedBill.date}</p>
            <p><span className="font-bold">Customer:</span> {selectedBill.customerName}</p>

            <table className="min-w-full bg-white border border-gray-300 mt-4">
              {/* ...table header... */}
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Description</th>
                  <th className="py-2 px-4 border-b text-right">Qty</th> 
                  <th className="py-2 px-4 border-b text-right">Rate</th> 
                  <th className="py-2 px-4 border-b text-right">Amount</th>
                </tr> 
              </thead>
              <tbody>
                {selectedBill.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{item.description}</td>
                    <td className="py-2 px-4 border-b text-right">{item.quantity}</td>
                    <td className="py-2 px-4 border-b text-right">{item.rate}</td>
                    <td className="py-2 px-4 border-b text-right">{item.amount}</td> 
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ... display totals and calculations ... */}
            <div className="mt-4">
              <div className="flex justify-end">
                <div className="w-1/2 text-right"> 
                  <div className="flex justify-between">
                    <span className="font-semibold">Subtotal:</span>
                    <span>₹{formatIndianCurrency(selectedBill.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Discount:</span>
                    <span>₹{formatIndianCurrency(selectedBill.discountAmount)}</span>
                  </div>
                  {/* ... other calculations ... */} 
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-bold">Grand Total:</span>
                    <span className="font-bold">₹{formatIndianCurrency(selectedBill.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default PreviousBills;

