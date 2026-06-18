import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import type { ProjectData } from '../types';

export const exportProjectToPdf = async (data: ProjectData, elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Temporarily make it visible for capture if it was hidden
    const originalDisplay = element.style.display;
    element.style.display = 'block';
    
    // We use a fixed width for the capture to ensure consistent rendering (e.g. A4 width at 96dpi is ~794px, let's use 1200px for high res)
    const scale = 2; // for better quality
    const dataUrl = await toPng(element, { 
      quality: 0.95, 
      pixelRatio: scale,
      backgroundColor: '#141414', // Match the dark theme background
    });

    // Revert display
    element.style.display = originalDisplay;

    // Create PDF (A4 format: 210 x 297 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Add the image to the PDF
    // We calculate the height to maintain aspect ratio
    const imgProps = pdf.getImageProperties(dataUrl);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // If the content is longer than one page, we might need multiple pages, 
    // but for simplicity in MVP, we fit it to width, and let it flow down (might truncate if very long).
    // A more advanced approach would slice the canvas, but let's stick to simple first.
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);

    pdf.save(`${data.title || 'SeriesCreator_Export'}.pdf`);
  } catch (err) {
    console.error('Error generating PDF', err);
    alert('Fehler beim PDF Export. Bitte versuche es erneut.');
  }
};
