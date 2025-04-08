
import { useResume } from "@/contexts/ResumeContext";
import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";

const ResumePreview = () => {
  const { resume } = useResume();
  
  const renderTemplate = () => {
    switch (resume.selectedTemplate) {
      case "classic":
        return <ClassicTemplate resume={resume} />;
      case "modern":
        return <ModernTemplate resume={resume} />;
      case "minimal":
        return <MinimalTemplate resume={resume} />;
      default:
        return <ClassicTemplate resume={resume} />;
    }
  };

  return (
    <div className="resume-preview overflow-auto">
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
