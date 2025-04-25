export function generatePDF(data, startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 🎨 Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Datos Históricos', 105, 15, null, null, 'center');

    // 🗓️ Subtítulo con fechas
    doc.setFontSize(14);
    doc.text(`Rango de fechas: ${startDate} - ${endDate}`, 105, 25, null, null, 'center');
    doc.line(10, 30, 200, 30);

    // ⚙️ Verificamos que haya datos
    if (!data || data.length === 0) {
        doc.setFontSize(12);
        doc.text('No se encontraron datos para este rango de fechas.', 20, 50);
        doc.save(`historico_${startDate}_${endDate}.pdf`);
        return;
    }

    // 🧩 Tabla elegante con datos reales
    const columns = [
        { header: 'Fecha', dataKey: 'timestamp' },
        { header: 'Temperatura (°C)', dataKey: 'temperatura' },
        { header: 'Humedad (%)', dataKey: 'humedad' },
        { header: 'Luminosidad (lux)', dataKey: 'luminosidad' }
    ];

    const rows = data.map(row => ({
        timestamp: row.timestamp,
        temperatura: row.temperatura.toString(),
        humedad: row.humedad.toString(),
        luminosidad: row.luminosidad.toString()
    }));

    // ✨ autoTable con estilo
    doc.autoTable({
        columns: columns,
        body: rows,
        startY: 40,
        theme: 'grid',
        columnStyles: {
            timestamp: { cellWidth: 45 },
            temperatura: { cellWidth: 40 },
            humedad: { cellWidth: 40 },
            luminosidad: { cellWidth: 50 }
        },
        styles: {
            font: 'helvetica',
            fontSize: 10,
            halign: 'center',
            cellPadding: 3
        },
        headStyles: {
            fillColor: [255, 215, 0],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0]
        },
        margin: { top: 40, left: 10, right: 10 }
    });

    // 🧾 Footer
    const finalY = doc.lastAutoTable?.finalY || 50;
    doc.text('Fin de los datos', 10, finalY + 10);

    // 💾 Descargar
    doc.save(`historico_${startDate}_${endDate}.pdf`);
}



