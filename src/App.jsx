import { useState } from 'react';
import BillForm from './components/BillForm';
import BillPreview from './components/BillPreview';

function App() {
  const [billData, setBillData] = useState({
    invoiceNumber: '602',
    date: new Date().toISOString().substr(0, 10),
    gstin: '07AZTPS3304H1Z2',
    customerName: '',
    customerAddress: '',
    customerGstin: '',
    customerState: '',
    customerStateCode: '',
    customerPhone: '',
    items: [],
    paymentMode: 'Cash',
    discount: 0,
    sgstRate: 1.5,
    cgstRate: 1.5
  });

  const handleFormChange = (updatedData) => {
    setBillData({...billData, ...updatedData});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Jewelry Bill Generator</h1>
      <BillForm 
        billData={billData} 
        onFormChange={handleFormChange} 
        onPrint={handlePrint} 
      />
      <BillPreview billData={billData} />
    </div>
  );
}

export default App;