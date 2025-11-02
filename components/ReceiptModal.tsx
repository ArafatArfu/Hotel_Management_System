import React from 'react';
import type { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';

declare const html2canvas: any;
declare const jspdf: any;

interface ReceiptModalProps {
  order: Order;
  logo: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, logo, onClose, onConfirm }) => {
  const { t, language } = useLanguage();

  const handlePrint = () => {
    window.print();
  };
  
  const handleSaveAsPdf = () => {
    const { jsPDF } = jspdf;
    const receiptElement = document.getElementById('receipt-content');
    if (receiptElement) {
        html2canvas(receiptElement, {
            scale: 2, // Increase scale for better quality
            useCORS: true,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            
            // Typical thermal receipt width is ~80mm.
            const pdfWidth = 80; // mm
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });

            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save(`receipt-${order.id.replace('#', '')}.pdf`);
        });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language, { style: 'currency', currency: 'BDT' }).format(value).replace('BDT', '৳');
  }
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(language);
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString(language);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 print:bg-white print:items-start">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative print:shadow-none print:p-0 text-black">
        {/* Modal content for screen */}
        <div className="print:hidden">
          <h2 className="text-2xl font-bold text-center mb-4">{t('receiptModal.title')}</h2>
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        
        {/* Receipt Content for both screen and print */}
        <div id="receipt-content" className="font-mono text-sm text-black bg-white p-2">
          <div className="text-center mb-4">
            <img src={logo} alt="Restaurant Logo" className="w-32 h-auto mx-auto mb-2" />
            <p>1216-West Shewrapara, Mirpur 10</p>
            <p>Contact: +8801871520684</p>
          </div>
          <div className="border-t border-b border-dashed border-black py-2 mb-2">
            <p>{t('expenses.date')}: {formatDate(order.date)}</p>
            <p>{t('dashboard.dateTime').split(' ')[1]}: {formatTime(order.date)}</p>
            <p>{t('dashboard.receiptNo')}: {order.id}</p>
          </div>
          <div>
            <div className="flex font-bold border-b border-dashed border-black pb-1 mb-1">
              <span className="flex-1">{t('dashboard.items')}</span>
              <span className="w-24 text-right">{t('reports.salaryDetails')}</span>
              <span className="w-20 text-right">{t('dashboard.totalAmount')}</span>
            </div>
            <div>
              {order.items.map(item => (
                <div key={item.id} className="flex py-0.5">
                  <span className="flex-1 pr-1">{item.name}</span>
                  <span className="w-24 text-right text-xs">{item.quantity} x {item.price.toFixed(2)}</span>
                  <span className="w-20 text-right">{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-dashed border-black mt-2 pt-2 space-y-1">
            <div className="flex justify-between"><span>{t('order.subtotal')}:</span><span>{order.subtotal.toFixed(2)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span>{t('order.discount')}:</span><span>-{order.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>{t('order.tax', { rate: '' }).replace('()', '')}:</span><span>{order.tax.toFixed(2)}</span></div>
            {order.serviceCharge > 0 && <div className="flex justify-between"><span>{t('order.serviceCharge', { rate: '' }).replace('()', '')}:</span><span>{order.serviceCharge.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t border-black mt-1 pt-1">
                <span>{t('order.grandTotal')}:</span>
                <span>{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>
          <div className="text-center mt-4 pt-2 border-t border-dashed border-black">
            <p>{t('receiptModal.thankYou')}</p>
          </div>
        </div>
        
        {/* Action buttons for screen only */}
        <div className="mt-6 flex justify-end space-x-2 print:hidden">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300">{t('receiptModal.close')}</button>
          <button onClick={handlePrint} className="px-3 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600">{t('receiptModal.print')}</button>
          <button onClick={handleSaveAsPdf} className="px-3 py-1.5 text-sm font-medium bg-teal-500 text-white rounded-md hover:bg-teal-600">{t('receiptModal.saveAsPdf')}</button>
          {onConfirm && <button onClick={onConfirm} className="px-3 py-1.5 text-sm font-medium bg-green-500 text-white rounded-md hover:bg-green-600">{t('receiptModal.confirm')}</button>}
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