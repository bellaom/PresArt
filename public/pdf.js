export function generatePDF(data, startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Datos Históricos', 105, 15, null, null, 'center');
    
    // Subtítulo con rango de fechas
    doc.setFontSize(14);
    doc.text(`Rango de fechas: ${startDate} - ${endDate}`, 105, 25, null, null, 'center');
    
    // Línea divisoria
    doc.line(10, 30, 200, 30);

    // Información de los sensores
    doc.setFontSize(12);
    doc.text('Información de los sensores:', 10, 40);
    doc.line(10, 42, 200, 42);

    // Encabezados de la tabla
    let y = 50;
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha', 10, y);
    doc.text('Temperatura (°C)', 60, y);
    doc.text('Humedad (%)', 110, y);
    doc.text('Luminosidad (lux)', 160, y);
    doc.line(10, y + 2, 200, y + 2); // Línea de separación entre encabezados y datos
    y += 10;

    // Datos
    doc.setFont('helvetica', 'normal');
    data.forEach(row => {
        doc.text(row.timestamp, 10, y);  // Fecha
        doc.text(row.temperatura.toString(), 60, y, { align: 'right' });  // Temperatura alineada a la derecha
        doc.text(row.humedad.toString(), 110, y, { align: 'right' });     // Humedad alineada a la derecha
        doc.text(row.luminosidad.toString(), 160, y, { align: 'right' });  // Luminosidad alineada a la derecha
        y += 10;

        // Línea de separación entre filas de datos
        doc.line(10, y, 200, y);
    });

    // Fin de los datos
    doc.text('Fin de los datos', 10, y + 10);

    // Guardar el archivo PDF
    doc.save(`historico_${startDate}_${endDate}.pdf`);
}
