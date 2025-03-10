import { useState, useEffect } from 'react';
import BillForm from './components/BillForm';
import BillPreview from './components/BillPreview';
import * as XLSX from 'xlsx'; 
import PreviousBills from './components/PreviousBills'; // Create this component
import CustomersPage from './components/CustomersPage';  // Create this component
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

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
    cgstRate: 1.5,
    makingChargeRate: 10, // Default making charge rate
  });

  const [customers, setCustomers] = useState([]);

  // Load saved customers from local storage on component mount
  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    console.log('Loaded customers from local storage:', savedCustomers); // Debugging
    setCustomers(savedCustomers);
  }, []);

  // Save customers to local storage whenever the list changes
  useEffect(() => {
    console.log('Saving customers to local storage:', customers); // Debugging
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const handleFormChange = (updatedData) => {
    console.log('Updating billData:', updatedData); // Debugging
    setBillData((prevData) => ({ ...prevData, ...updatedData }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Save customer details when the form is submitted
  const saveCustomerDetails = () => {
    const { customerName, customerAddress, customerGstin, customerState, customerStateCode, customerPhone } = billData;

    console.log('Saving customer:', customerName); // Debugging

    if (!customerName) {
      alert('Please enter a customer name.');
      return;
    }

    const newCustomer = {
      name: customerName,
      address: customerAddress,
      gstin: customerGstin,
      state: customerState,
      stateCode: customerStateCode,
      phone: customerPhone,
    };

    console.log('New customer data:', newCustomer); // Debugging

    // Check if the customer already exists
    const existingCustomerIndex = customers.findIndex(
      (customer) => customer.name.toLowerCase() === customerName.toLowerCase()
    );

    if (existingCustomerIndex !== -1) {
      // Update existing customer
      const updatedCustomers = [...customers];
      updatedCustomers[existingCustomerIndex] = newCustomer;
      setCustomers(updatedCustomers);
      console.log('Updated customer:', newCustomer); // Debugging
    } else {
      // Add new customer
      setCustomers([...customers, newCustomer]);
      console.log('Added new customer:', newCustomer); // Debugging
    }
  };

  // Auto-fill customer details when the name is entered
  const autoFillCustomerDetails = (name) => {
    const customer = customers.find(
      (customer) => customer.name.toLowerCase() === name.toLowerCase()
    );

    if (customer) {
      setBillData((prevData) => ({
        ...prevData,
        customerName: customer.name,
        customerAddress: customer.address,
        customerGstin: customer.gstin,
        customerState: customer.state,
        customerStateCode: customer.stateCode,
        customerPhone: customer.phone,
      }));
    }
  };

  const exportCustomersToExcel = () => {
    const dataToExport = customers.map(customer => ({
      'Customer Name': customer.name,
      'Address': customer.address,
      'GSTIN': customer.gstin,
      'State': customer.state,
      'State Code': customer.stateCode,
      'Phone': customer.phone,
    }));
  
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  
    XLSX.writeFile(wb, 'customer_data.xlsx');
  };

  const saveBillToLocalStorage = (billData) => {
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    bills.push(billData); 
    localStorage.setItem('bills', JSON.stringify(bills));
  };
  

  return (
    <BrowserRouter>
      <div> 
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/previous-bills">Previous Bills</Link></li>
            <li><Link to="/customers">Customers</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={ 
            <div className="max-w-6xl mx-auto p-6">
              <h1 className="text-3xl font-bold mb-6">Jewelry Bill Generator</h1>
              <BillForm
                billData={billData}
                onFormChange={handleFormChange}
                onPrint={handlePrint}
                onSaveCustomer={saveCustomerDetails}
                onAutoFillCustomer={autoFillCustomerDetails}
              />
              <BillPreview billData={billData} />
            </div>
          } />
          <Route path="/previous-bills" element={<PreviousBills />} />
          <Route path="/customers" element={<CustomersPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;