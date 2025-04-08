
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Download, FileType2, ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

const ResumeExport = () => {
  const { toast } = useToast();

  const exportAsPDF = async () => {
    const resumeElement = document.querySelector(".resume-preview");
    if (!resumeElement) return;

    toast({
      title: "Generating PDF",
      description: "Please wait while we create your PDF...",
    });

    try {
      const canvas = await html2canvas(resumeElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [595, 842], // A4 size in pixels at 72 DPI
      });
      
      const imgWidth = 595;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("resume.pdf");
      
      toast({
        title: "PDF Download Complete",
        description: "Your resume has been downloaded as a PDF file.",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportAsImage = async () => {
    const resumeElement = document.querySelector(".resume-preview");
    if (!resumeElement) return;

    toast({
      title: "Generating Image",
      description: "Please wait while we create your image...",
    });

    try {
      const canvas = await html2canvas(resumeElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const link = document.createElement("a");
      link.download = "resume.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast({
        title: "Image Download Complete",
        description: "Your resume has been downloaded as an image file.",
      });
    } catch (error) {
      console.error("Image generation failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportAsWordDoc = () => {
    toast({
      title: "Coming Soon",
      description: "Word document export will be available in a future update.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Resume
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsWordDoc}>
          <FileType2 className="mr-2 h-4 w-4" />
          Download as Word
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsImage}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Download as Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResumeExport;
