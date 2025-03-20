export function generatePDF(data, startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Datos Históricos', 105, 15, null, null, 'center');
    doc.setFontSize(14);
    doc.text(`Rango de fechas: ${startDate} - ${endDate}`, 105, 25, null, null, 'center');
    doc.line(10, 30, 200, 30);

    doc.setFontSize(12);
    doc.text('Información de los sensores:', 10, 40);
    doc.line(10, 42, 200, 42);

    let y = 50;
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha', 10, y);
    doc.text('Temperatura (°C)', 55, y);
    doc.text('Humedad (%)', 100, y);
    doc.text('Luminosidad (lux)', 145, y);
    doc.line(10, y + 2, 200, y + 2);
    y += 10;

    doc.setFont('helvetica', 'normal');
    data.forEach(row => {
        doc.text(row.timestamp, 10, y);
        doc.text(row.temperatura.toString(), 55, y);
        doc.text(row.humedad.toString(), 100, y);
        doc.text(row.luminosidad.toString(), 145, y);
        y += 10;
        doc.line(10, y, 200, y);
    });

    doc.text('Fin de los datos', 10, y + 10);
    doc.save(`historico_${startDate}_${endDate}.pdf`);
}
