import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Symptom } from '@/types';

export const exportToCSV = (symptoms: Symptom[]) => {
  if (symptoms.length === 0) {
    return null;
  }

  const headers = ['Date', 'Time', 'Symptom', 'Description'];
  const rows = symptoms.map(s => [
    s.date,
    s.time,
    s.name,
    s.description || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `symptom-tracker-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};

export const exportToPDF = (symptoms: Symptom[], language: string = 'en') => {
  if (symptoms.length === 0) {
    return null;
  }

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(language === 'hi' ? 'लक्षण ट्रैकर रिपोर्ट' : 'Symptom Tracker Report', 14, 20);
  
  // Metadata
  doc.setFontSize(10);
  doc.text(`${language === 'hi' ? 'उत्पन्न' : 'Generated'}: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text(`${language === 'hi' ? 'कुल लक्षण' : 'Total Symptoms'}: ${symptoms.length}`, 14, 36);
  
  // Table
  const tableData = symptoms.map(s => [
    s.date,
    s.time,
    s.name,
    s.description || 'N/A'
  ]);
  
  autoTable(doc, {
    startY: 45,
    head: [[
      language === 'hi' ? 'तारीख' : 'Date',
      language === 'hi' ? 'समय' : 'Time',
      language === 'hi' ? 'लक्षण' : 'Symptom',
      language === 'hi' ? 'विवरण' : 'Description'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
  });
  
  doc.save(`symptom-tracker-${new Date().toISOString().split('T')[0]}.pdf`);
  
  return true;
};

export const exportDashboardToPDF = (stats: any, language: string = 'en') => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Title
  doc.setFontSize(18);
  doc.text(language === 'hi' ? 'स्वास्थ्य डैशबोर्ड रिपोर्ट' : 'Health Dashboard Report', 14, yPosition);
  yPosition += 15;

  // Metadata
  doc.setFontSize(10);
  doc.text(`${language === 'hi' ? 'तारीख' : 'Date'}: ${new Date().toLocaleDateString()}`, 14, yPosition);
  yPosition += 8;

  // Statistics Summary
  doc.setFontSize(14);
  doc.text(language === 'hi' ? 'सारांश' : 'Summary', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  const summaryData = [
    [
      language === 'hi' ? 'कुल लक्षण' : 'Total Symptoms',
      stats.totalSymptoms.toString(),
    ],
    [language === 'hi' ? 'औसत गंभीरता' : 'Average Severity', stats.averageSeverity],
    [language === 'hi' ? 'दवाएं खरीदी' : 'Medicines Purchased', stats.medicinesPurchased.toString()],
    [language === 'hi' ? 'नियुक्तियां' : 'Appointments', stats.appointmentsBooked.toString()],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [[
      language === 'hi' ? 'मेट्रिक' : 'Metric',
      language === 'hi' ? 'मूल्य' : 'Value',
    ]],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Symptom Frequency
  if (stats.symptomFrequency.length > 0) {
    doc.setFontSize(14);
    doc.text(language === 'hi' ? 'लक्षण आवृत्ति' : 'Symptom Frequency', 14, yPosition);
    yPosition += 10;

    const frequencyData = stats.symptomFrequency.map((s: any) => [s.name, s.value.toString()]);

    autoTable(doc, {
      startY: yPosition,
      head: [[language === 'hi' ? 'लक्षण' : 'Symptom', language === 'hi' ? 'गणना' : 'Count']],
      body: frequencyData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Medicine History
  if (stats.medicineHistory.length > 0) {
    doc.setFontSize(14);
    doc.text(language === 'hi' ? 'दवा इतिहास' : 'Medicine History', 14, yPosition);
    yPosition += 10;

    const medicineData = stats.medicineHistory.map((m: any) => [
      m.name,
      m.quantity.toString(),
      m.date,
      `₹${m.price}`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [[
        language === 'hi' ? 'दवा' : 'Medicine',
        language === 'hi' ? 'मात्रा' : 'Quantity',
        language === 'hi' ? 'तारीख' : 'Date',
        language === 'hi' ? 'कीमत' : 'Price',
      ]],
      body: medicineData,
      theme: 'grid',
      headStyles: { fillColor: [244, 63, 94] },
    });
  }

  doc.save(`health-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
  return true;
};

export const exportDashboardToCSV = (stats: any, language: string = 'en') => {
  const headers = [
    language === 'hi' ? 'मेट्रिक' : 'Metric',
    language === 'hi' ? 'मूल्य' : 'Value',
  ];

  const rows = [
    [language === 'hi' ? 'कुल लक्षण' : 'Total Symptoms', stats.totalSymptoms],
    [language === 'hi' ? 'औसत गंभीरता' : 'Average Severity', stats.averageSeverity],
    [language === 'hi' ? 'दवाएं खरीदी' : 'Medicines Purchased', stats.medicinesPurchased],
    [language === 'hi' ? 'नियुक्तियां' : 'Appointments', stats.appointmentsBooked],
    [],
    [language === 'hi' ? 'लक्षण आवृत्ति' : 'Symptom Frequency', ''],
  ];

  if (stats.symptomFrequency.length > 0) {
    stats.symptomFrequency.forEach((s: any) => {
      rows.push([s.name, s.value]);
    });
  }

  rows.push([], [language === 'hi' ? 'दवा इतिहास' : 'Medicine History', '']);

  if (stats.medicineHistory.length > 0) {
    stats.medicineHistory.forEach((m: any) => {
      rows.push([m.name, `₹${m.price} (${m.quantity}x)`]);
    });
  }

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `health-dashboard-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};