
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import jsPDF from "jspdf";

interface ResumeExportProps {
  iconOnly?: boolean;
}

const ResumeExport: React.FC<ResumeExportProps> = ({ iconOnly = false }) => {
  const { toast } = useToast();
  const { resume } = useResume();

  const handleExport = () => {
    try {
      // Get the resume preview element
      const element = document.querySelector(".resume-preview");
      
      if (!element) {
        throw new Error("Could not find resume preview element");
      }

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Convert the element to PDF
      pdf.html(element, {
        callback: function (pdf) {
          // Save the PDF
          pdf.save(`${resume.personal.fullName || "resume"}.pdf`);
          
          // Show success toast
          toast({
            title: "Resume exported",
            description: "Your resume has been exported to PDF",
          });
        },
        x: 0,
        y: 0,
        width: 595, // A4 width in points
        windowWidth: 595,
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
