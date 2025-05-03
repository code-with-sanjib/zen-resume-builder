
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ResumeExportProps {
  iconOnly?: boolean;
}

export const calculatePages = async (element: HTMLElement): Promise<number> => {
  if (!element) return 1;
  
  // Create a clone of the element to manipulate
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Set up the clone for measurement - create a temporary container
  const tempContainer = document.createElement('div');
  tempContainer.appendChild(clonedElement);
  document.body.appendChild(tempContainer);
  
  // Set styles for proper rendering
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  clonedElement.style.transform = 'none';
  
  // Set fixed dimensions for A4 paper in pixels
  clonedElement.style.width = '794px'; // A4 width at 96 DPI
  clonedElement.style.height = 'auto'; // Let height adjust based on content
  clonedElement.style.padding = '40px';
  
  // Remove any UI controls or buttons that should not be in the measurement
  const controlsToRemove = clonedElement.querySelectorAll('.sticky, button, .pagination-controls');
  controlsToRemove.forEach(control => {
    (control as HTMLElement).remove();
  });

  // Use html2canvas to measure the content
  const canvas = await html2canvas(clonedElement, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });
  
  // Clean up the temporary element
  document.body.removeChild(tempContainer);
  
  // A4 height in points is 842, calculate how many pages we need
  const imgWidth = 595; // A4 width in points
  const imgHeight = canvas.height * imgWidth / canvas.width;
  const pageHeight = 842; // A4 height in points
  
  // Calculate total pages, ensuring at least 1
  return Math.max(1, Math.ceil(imgHeight / pageHeight));
};

const ResumeExport: React.FC<ResumeExportProps> = ({ iconOnly = false }) => {
  const { toast } = useToast();
  const { resume } = useResume();

  const handleExport = async () => {
    try {
      // Get the resume preview element
      const element = document.querySelector(".resume-preview-content") as HTMLElement;
      
      if (!element) {
        throw new Error("Could not find resume preview element");
      }
      
      // Create a clone of the element to manipulate
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Set up the clone for export - create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);
      
      // Set styles for proper rendering
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      clonedElement.style.transform = 'none';
      
      // Set fixed dimensions for A4 paper in pixels (roughly 210mm × 297mm at 96 DPI)
      clonedElement.style.width = '794px'; // A4 width at 96 DPI
      clonedElement.style.height = 'auto'; // Let height adjust based on content
      clonedElement.style.padding = '40px';
      
      // Remove any UI controls or buttons that should not be in the PDF
      const controlsToRemove = clonedElement.querySelectorAll('.sticky, button, .pagination-controls');
      controlsToRemove.forEach(control => {
        (control as HTMLElement).remove();
      });

      // Use html2canvas for better rendering
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Create a new jsPDF instance with appropriate dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling']
      });
      
      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 595; // A4 width in points
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Check if content overflows a page and add more pages if needed
      if (imgHeight > 842) { // A4 height in points
        let heightLeft = imgHeight - 842;
        let position = -842;
        
        while (heightLeft > 0) {
          position -= 842;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= 842;
        }
      }
      
      // Save the PDF
      pdf.save(`${resume.personal.fullName || "resume"}.pdf`);
      
      // Clean up the temporary element
      document.body.removeChild(tempContainer);
      
      // Show success toast
      toast({
        title: "Resume exported",
        description: "Your resume has been exported to PDF",
      });
    } catch (error) {
      console.error("Error exporting resume:", error);
      
      // Show error toast
      toast({
        title: "Export failed",
        description: "Could not export resume to PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleExport} variant={iconOnly ? "ghost" : "default"} size={iconOnly ? "icon" : "default"} className={iconOnly ? "rounded-full" : ""}>
      <Download className={`${iconOnly ? "w-5 h-5" : "mr-2 w-4 h-4"}`} />
      {!iconOnly && "Export PDF"}
    </Button>
  );
};

export default ResumeExport;
