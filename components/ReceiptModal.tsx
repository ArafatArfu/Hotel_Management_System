
import React from 'react';
import type { Order } from '../types';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
  onConfirm?: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose, onConfirm }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 print:bg-white print:items-start">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative print:shadow-none print:p-0">
        {/* Modal content for screen */}
        <div className="print:hidden">
          <h2 className="text-2xl font-bold text-center mb-4">Order Receipt</h2>
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        
        {/* Receipt Content for both screen and print */}
        <div id="receipt-content" className="font-mono text-sm text-black">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Al Madina Hotel</h3>
            <p>123 Restaurant St, Food City</p>
            <p>Contact: +880123456789</p>
          </div>
          <div className="border-t border-b border-dashed border-black py-2 mb-2">
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Time: {new Date(order.date).toLocaleTimeString()}</p>
            <p>Receipt No: {order.id}</p>
          </div>
          <div>
            <div className="flex justify-between font-bold">
              <span>Item</span>
              <span>Total</span>
            </div>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p>{item.name}</p>
                  <p className="pl-2">({item.quantity} x {item.price.toFixed(2)})</p>
                </div>
                <span>{(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-black mt-2 pt-2 space-y-1">
            <div className="flex justify-between"><span>Subtotal:</span><span>{order.subtotal.toFixed(2)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span>Discount:</span><span>-{order.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>Tax:</span><span>{order.tax.toFixed(2)}</span></div>
            {order.serviceCharge > 0 && <div className="flex justify-between"><span>Service Charge:</span><span>{order.serviceCharge.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t border-black mt-1 pt-1">
                <span>Grand Total:</span>
                <span>৳{order.grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-center mt-4 pt-2 border-t border-dashed border-black">
            <p>Thank you for dining with us!</p>
          </div>
        </div>
        
        {/* Action buttons for screen only */}
        <div className="mt-6 flex justify-end space-x-3 print:hidden">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Print Receipt</button>
          {onConfirm && <button onClick={onConfirm} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Confirm Order</button>}
        </div>
      </div>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #receipt-content, #receipt-content * {
              visibility: visible;
            }
            #receipt-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ReceiptModal;
