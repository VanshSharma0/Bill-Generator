import { useState } from 'react';

function BillForm({ billData, onFormChange, onPrint, onSaveCustomer, onAutoFillCustomer }) {
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    grossWeight: 0,
    netWeight: 0,
    rate: 0,
    amount: 0,
  });

  const [editingItemId, setEditingItemId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, value); // Debugging
    onFormChange({ [name]: value });
  
    // Auto-fill customer details when the name is entered
    if (name === 'customerName') {
      onAutoFillCustomer(value);
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = { ...newItem, [name]: value };

    // Auto calculate amount
    if (name === 'rate' || name === 'netWeight') {
      updatedItem.amount = (parseFloat(updatedItem.rate) * parseFloat(updatedItem.netWeight)).toFixed(2);
    }

    setNewItem(updatedItem);
  };

  const addItem = () => {
    if (isEditing) {
      // Update existing item
      const updatedItems = billData.items.map((item) =>
        item.id === editingItemId ? { ...newItem, id: editingItemId } : item
      );
      onFormChange({ items: updatedItems });
      setIsEditing(false);
    } else {
      // Add new item
      const items = [...billData.items, { ...newItem, id: Date.now() }];
      onFormChange({ items });
    }

    // Reset form
    setNewItem({
      description: '',
      quantity: 1,
      grossWeight: 0,
      netWeight: 0,
      rate: 0,
      amount: 0,
    });
    setEditingItemId(null);
  };

  const editItem = (itemId) => {
    const itemToEdit = billData.items.find((item) => item.id === itemId);
    if (itemToEdit) {
      setNewItem({ ...itemToEdit });
      setEditingItemId(itemId);
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setNewItem({
      description: '',
      quantity: 1,
      grossWeight: 0,
      netWeight: 0,
      rate: 0,
      amount: 0,
    });
    setEditingItemId(null);
    setIsEditing(false);
  };

  const removeItem = (itemId) => {
    const items = billData.items.filter((item) => item.id !== itemId);
    onFormChange({ items });
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
      {/* Customer Details Section */}
      <h3 className="text-xl font-semibold mb-3 border-b pb-2">Customer Details</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            name="customerName"
            value={billData.customerName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
          <input
            type="text"
            name="customerPhone"
            value={billData.customerPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
        <input
          type="text"
          name="customerAddress"
          value={billData.customerAddress}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN:</label>
          <input
            type="text"
            name="customerGstin"
            value={billData.customerGstin}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">State:</label>
          <input
            type="text"
            name="customerState"
            value={billData.customerState}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Save Customer Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onSaveCustomer}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Save Customer Details
        </button>
      </div>


      <h3 className="text-xl font-semibold mb-3 border-b pb-2">Item Details</h3>
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <div className="grid grid-cols-5 gap-2 mb-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleItemChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
              rows="3"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleItemChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Gross Wt</label>
            <input
              type="number"
              name="grossWeight"
              value={newItem.grossWeight}
              onChange={handleItemChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
              step="0.01"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Net Wt</label>
            <input
              type="number"
              name="netWeight"
              value={newItem.netWeight}
              onChange={handleItemChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
              step="0.01"
            />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Rate</label>
            <input
              type="number"
              name="rate"
              value={newItem.rate}
              onChange={handleItemChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={newItem.amount}
              onChange={handleItemChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
              readOnly
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addItem}
            className={`${isEditing ? 'bg-blue-600' : 'bg-green-600'} text-white px-3 py-1 rounded-md hover:${isEditing ? 'bg-blue-700' : 'bg-green-700'} text-sm`}
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {billData.items.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Added Items</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">Description</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">Qty</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">Gross Wt</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">Net Wt</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">Rate</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">Amount</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {billData.items.map(item => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.description}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.quantity}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.grossWeight}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.netWeight}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.rate}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.amount}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => editItem(item.id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode:</label>
          <select
            name="paymentMode"
            value={billData.paymentMode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%):</label>
          <input
            type="number"
            name="discount"
            value={billData.discount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
          />
        </div>
      </div>

      {/* Add Making Charges Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Making Charges (%):</label>
        <input
          type="number"
          name="makingChargeRate"
          value={billData.makingChargeRate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          step="0.01"
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onPrint}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Print Bill
        </button>
      </div>
    </div>
  );
}

export default BillForm;