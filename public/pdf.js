export function generatePDF(data, startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Agregar título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Datos Históricos', 105, 15, null, null, 'center');
    
    // Subtítulo con rango de fechas
    doc.setFontSize(14);
    doc.text(`Rango de fechas: ${startDate} - ${endDate}`, 105, 25, null, null, 'center');
    
    // Línea divisoria
    doc.line(10, 30, 200, 30);

    // Crear una tabla usando autoTable
    const tableColumns = [
        { title: 'Fecha', dataKey: 'timestamp' },
        { title: 'Temperatura (°C)', dataKey: 'temperatura' },
        { title: 'Humedad (%)', dataKey: 'humedad' },
        { title: 'Luminosidad (lux)', dataKey: 'luminosidad' }
    ];

    const tableData = data.map(row => ({
        timestamp: row.timestamp,
        temperatura: row.temperatura.toString(),
        humedad: row.humedad.toString(),
        luminosidad: row.luminosidad.toString()
    }));

    // Definir el estilo de la tabla
    doc.autoTable({
        head: [tableColumns],
        body: tableData,
        startY: 40,  // Posición de inicio de la tabla
        theme: 'grid',  // Estilo con bordes
        columnStyles: {
            timestamp: { cellWidth: 40, halign: 'center' },
            temperatura: { cellWidth: 40, halign: 'center' },
            humedad: { cellWidth: 40, halign: 'center' },
            luminosidad: { cellWidth: 40, halign: 'center' }
        },
        styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [255, 215, 0], // Color de fondo de los encabezados
            textColor: [0, 0, 0], // Color de texto de los encabezados
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fillColor: [255, 255, 255], // Color de fondo de las celdas
            textColor: [0, 0, 0], // Color de texto de las celdas
            halign: 'center'
        },
        margin: { top: 30, left: 10, right: 10 },
        showHead: 'firstPage'
    });

    // Agregar pie de página
    doc.text('Fin de los datos', 10, doc.lastAutoTable.finalY + 10);

    // Guardar el archivo PDF
    doc.save(`historico_${startDate}_${endDate}.pdf`);
}

