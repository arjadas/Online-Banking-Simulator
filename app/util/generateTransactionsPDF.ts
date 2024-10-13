import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface TransactionData {
    sender: string;
    recipient: string;
    amount: number;
    timestamp: string;
    sender_acc: number;
    recipient_acc: number;
    reference: string;
    description: string;
  }

  export const generateTransactionsPDF = (transactions: TransactionData[]) => {
    const doc = new jsPDF();
  
    // Add title
    doc.setFontSize(18);
    doc.text('Transaction History', 14, 22);
  
    // Add current date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
    // Define the columns for the table
    const columns = [
      { header: 'Date', dataKey: 'timestamp' },
      { header: 'From', dataKey: 'sender' },
      { header: 'To', dataKey: 'recipient' },
      { header: 'Amount', dataKey: 'amount' },
      { header: 'Reference', dataKey: 'reference' },
      { header: 'Description', dataKey: 'description' },
    ];
  
    // Prepare the data for the table
    const data = transactions.map(tx => ({
      ...tx,
      timestamp: new Date(tx.timestamp).toLocaleDateString(),
      amount: `$${tx.amount.toFixed(2)}`,
    }));
  
    // Generate the table
    (doc as any).autoTable({
      columns,
      body: data,
      startY: 40,
      styles: { fontSize: 8 },
      columnStyles: { 
        timestamp: { cellWidth: 'auto' },
        sender: { cellWidth: 'auto' },
        recipient: { cellWidth: 'auto' },
        amount: { cellWidth: 'auto' },
        reference: { cellWidth: 'auto' },
      },
    });
  
    // Save the PDF
    doc.save('transaction_history.pdf');
  };