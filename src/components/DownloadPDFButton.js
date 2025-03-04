import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const DownloadPDFButton = ({ targetRef, fileName = "documento" }) => {
  const [showFooter, setShowFooter] = useState(false);

  const downloadPDF = async () => {
    if (!targetRef.current) return;

    setShowFooter(true); // Mostra il footer prima di generare il PDF
    await new Promise((resolve) => setTimeout(resolve, 100)); // Aspetta il rendering del footer

    const element = targetRef.current;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;

    if (imgHeight <= pageHeight - 5) {
      pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth - 20, imgHeight + 30);
    } else {
      let heightLeft = imgHeight;
      let position = 10;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 10, position, imgWidth - 20, imgHeight);
        heightLeft -= pageHeight - 20;
        if (heightLeft > 0) {
          pdf.addPage();
          position = 10;
        }
      }
    }

    pdf.save(`${fileName}.pdf`);
    setShowFooter(false); // Nasconde il footer dopo il salvataggio
  };

  return (
    <>
      <button
        onClick={downloadPDF}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-4 scale-75 shadow-md absolute -right-1"
      >
        Scarica PDF
      </button>

      {showFooter && (
        <div className="hidden-pdf-footer absolute">
          <p className=" text-gray-500 text-sm mt-4 text-left">
            {new Date().toLocaleDateString()}<br></br> netlify.sys-c.app<br></br>@Pepperubino.crow (Instagram)
          </p>
        </div>
  )}
    </>
  );
};

export default DownloadPDFButton;
