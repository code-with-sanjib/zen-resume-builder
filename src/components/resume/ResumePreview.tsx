import { useResume } from "@/contexts/ResumeContext";
import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ExtracurricularSection from "./sections/ExtracurricularSection";
import ReferencesSection from "./sections/ReferencesSection";
import InternshipsSection from "./sections/InternshipsSection";
import LanguagesSection from "./sections/LanguagesSection";
import HobbiesSection from "./sections/HobbiesSection";
import CoursesSection from "./sections/CoursesSection";
import ProjectsSection from "./sections/ProjectsSection";
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
    
    // Add new sections after the template
    return (
      <>
        {templateContent}
        <div className="mt-4 px-6">
          {/* New sections */}
          {resume.extracurricular && resume.extracurricular.length > 0 && (
            <ExtracurricularSection extracurricular={resume.extracurricular} />
          )}
          
          {resume.references && resume.references.length > 0 && (
            <ReferencesSection references={resume.references} />
          )}
          
          {resume.internships && resume.internships.length > 0 && (
            <InternshipsSection internships={resume.internships} />
          )}
          
          {resume.languages && resume.languages.length > 0 && (
            <LanguagesSection languages={resume.languages} />
          )}
          
          {resume.hobbies && resume.hobbies.length > 0 && (
            <HobbiesSection hobbies={resume.hobbies} />
          )}
          
          {resume.courses && resume.courses.length > 0 && (
            <CoursesSection courses={resume.courses} />
          )}
          
          {resume.projects && resume.projects.length > 0 && (
            <ProjectsSection projects={resume.projects} />
          )}
          
          {/* Keep custom sections for backward compatibility */}
          {resume.customSections && resume.customSections.length > 0 && (
            <CustomSections customSections={resume.customSections} />
          )}
        </div>
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
