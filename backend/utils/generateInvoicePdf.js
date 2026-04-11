const PDFDocument = require('pdfkit');

const generateInvoicePdf = (invoice, business, res) => {
  const doc = new PDFDocument({ margin: 50 });


  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice-${invoice._id}.pdf`
  );

  doc.pipe(res);

  doc
    .fontSize(20)
    .text(business.businessName || "Your Business", { align: 'center' });

  doc
    .fontSize(10)
    .text(business.address || "", { align: 'center' });

  doc.moveDown();


  doc.fontSize(16).text("Invoice");

  doc.text(`Customer: ${invoice.customerName}`);
  doc.text(`Date: ${invoice.createdAt.toDateString()}`);

  doc.moveDown();

  doc.text("Items:");

  invoice.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} - Qty: ${item.quantity} - Rs ${item.price}`
    );
  });

  doc.moveDown();


  doc.fontSize(14).text(`Total: Rs ${invoice.totalAmount}`, {
    align: 'right'
  });

  doc.end();
};

module.exports = generateInvoicePdf;