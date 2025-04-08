
import { useResume } from "@/contexts/ResumeContext";
import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CustomSections from "./CustomSections";

const ResumePreview = () => {
  const { resume } = useResume();
  
  const renderTemplate = () => {
    // Render the main template based on selection
    const templateContent = (() => {
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
    })();
    
    // Add custom sections after the template
    return (
      <>
        {templateContent}
        {/* Add custom sections at the bottom of any template */}
        {resume.customSections.length > 0 && (
          <div className="mt-4 px-6">
            <CustomSections customSections={resume.customSections} />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="resume-preview overflow-auto">
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
