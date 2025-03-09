import React from 'react';

function BillPreview({ billData }) {
  // Calculate totals
  const subtotal = billData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const discountAmount = (subtotal * (billData.discount / 100)) || 0;
  const taxableAmount = subtotal - discountAmount;
  const sgstAmount = (taxableAmount * (billData.sgstRate / 100)) || 0;
  const cgstAmount = (taxableAmount * (billData.cgstRate / 100)) || 0;
  const grandTotal = taxableAmount + sgstAmount + cgstAmount;

  const formattedDate = new Date(billData.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="bill-preview bg-white p-6 border border-gray-800 rounded shadow-lg print:border-0 print:shadow-none max-w-4xl mx-auto">
      <div className="text-center pb-3 border-b border-gray-800">
        <h1 className="text-2xl font-bold">MURTI JEWELLERS</h1>
        <p className="text-base">Gold Diamond & Silver Ornaments</p>
        <p className="text-xs">Rz-99, Manas Kunj, New Delhi-110059</p>
        <p className="text-xs">Phone: 011-49090583</p>
      </div>

      <div className="flex justify-between py-2 border-b border-gray-800">
        <div className="w-1/2">
          <h2 className="text-base font-bold">GST INVOICE</h2>
          <p className="text-sm"><span className="font-semibold">GSTIN:</span> {billData.gstin}</p>
        </div>
        <div className="w-1/2 text-right">
          <p className="text-sm"><span className="font-semibold">SERIAL NO:</span> {billData.invoiceNumber}</p>
          <p className="text-sm"><span className="font-semibold">DATE:</span> {formattedDate}</p>
        </div>
      </div>

      <div className="py-2 border-b border-gray-800">
        <h3 className="font-bold text-sm mb-1">Details of Receiver (Billed To):</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm"><span className="font-semibold">Name:</span> {billData.customerName}</p>
            <p className="text-sm"><span className="font-semibold">Address:</span> {billData.customerAddress}</p>
            <p className="text-sm"><span className="font-semibold">GSTIN No:</span> {billData.customerGstin}</p>
          </div>
          <div className="text-right">
            <p className="text-sm"><span className="font-semibold">State:</span> {billData.customerState}</p>
            <p className="text-sm"><span className="font-semibold">State Code:</span> {billData.customerStateCode}</p>
            <p className="text-sm"><span className="font-semibold">Phone:</span> {billData.customerPhone}</p>
          </div>
        </div>
      </div>

      <div className="py-2">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-800 p-1 text-left">S.No.</th>
              <th className="border border-gray-800 p-1 text-left">Description</th>
              <th className="border border-gray-800 p-1 text-left">Qty.</th>
              <th className="border border-gray-800 p-1 text-left">Gross Wt.</th>
              <th className="border border-gray-800 p-1 text-left">Net Wt.</th>
              <th className="border border-gray-800 p-1 text-left">Rate</th>
              <th className="border border-gray-800 p-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {billData.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-gray-800 p-1">{index + 1}</td>
                <td className="border border-gray-800 p-1">{item.description}</td>
                <td className="border border-gray-800 p-1">{item.quantity}</td>
                <td className="border border-gray-800 p-1">{item.grossWeight}</td>
                <td className="border border-gray-800 p-1">{item.netWeight}</td>
                <td className="border border-gray-800 p-1">{item.rate}</td>
                <td className="border border-gray-800 p-1 text-right">₹ {parseFloat(item.amount).toFixed(2)}</td>
              </tr>
            ))}
            {/* Empty rows to fill space, limited to ensure page fit */}
            {[...Array(Math.max(0, Math.min(3, 5 - billData.items.length)))].map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="border border-gray-800 p-1">&nbsp;</td>
                <td className="border border-gray-800 p-1"></td>
                <td className="border border-gray-800 p-1"></td>
                <td className="border border-gray-800 p-1"></td>
                <td className="border border-gray-800 p-1"></td>
                <td className="border border-gray-800 p-1"></td>
                <td className="border border-gray-800 p-1"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between py-2">
        <div className="w-1/2">
          <p className="text-sm font-bold">MODE OF PAYMENT: {billData.paymentMode}</p>
          <div className="mt-2">
            <h4 className="text-sm font-bold">Terms & Conditions</h4>
            <p className="text-xs">1. NO RETURN VALUE OF STONE, PEARLS & MEENA</p>
            <p className="text-xs">2. No encashment or exchange without presentation of SALE Voucher</p>
          </div>
        </div>
        <div className="w-1/2 border-l border-gray-800 pl-2">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 font-semibold">WHOLE MARK PER PCS</td>
                <td className="py-1 text-right">₹ {subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">DISCOUNT</td>
                <td className="py-1 text-right">₹ {discountAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-gray-400">
                <td className="py-1 font-semibold">TAXABLE AMOUNT</td>
                <td className="py-1 text-right">₹ {taxableAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">SGST {billData.sgstRate}%</td>
                <td className="py-1 text-right">₹ {sgstAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">CGST {billData.cgstRate}%</td>
                <td className="py-1 text-right">₹ {cgstAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-gray-400">
                <td className="py-1 font-bold">GRAND TOTAL</td>
                <td className="py-1 text-right font-bold">₹ {grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="py-2 mt-2 border-t border-gray-800 text-xs leading-tight">
        <p className="text-justify">
          I have voluntarily, willingly and after fully satisfying myself of the quality, purity, standard, design and
          specification(s) of the article(s) of goods ornaments(s), mentioned in this Bill with full and complete
          understanding of the contents of this bill, explanation and clarifications.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <div>
          <p className="text-sm">Customer's Signature</p>
        </div>
        <div>
          <p className="text-sm">For MURTI JEWELLERS</p>
          <p className="mt-4 text-sm">Authorised Signatory</p>
        </div>
      </div>
    </div>
  );
}

export default BillPreview;