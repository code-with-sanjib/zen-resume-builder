import { useResume } from "@/contexts/ResumeContext";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import { sampleResume } from "@/data/sampleResume";
import ExtracurricularSection from "./sections/ExtracurricularSection";
import ReferencesSection from "./sections/ReferencesSection";
import InternshipsSection from "./sections/InternshipsSection";
import LanguagesSection from "./sections/LanguagesSection";
import HobbiesSection from "./sections/HobbiesSection";
import CoursesSection from "./sections/CoursesSection";
import ProjectsSection from "./sections/ProjectsSection";
import LinksSection from "./sections/LinksSection";
import CustomSections from "./CustomSections";

const ResumePreview = () => {
  const { resume } = useResume();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSample, setShowSample] = useState(!resume.personal.fullName);

  const previewResume = showSample ? sampleResume : resume;
  
  const renderTemplate = () => {
    // First render the main template based on selection
    const templateContent = (() => {
      switch (previewResume.selectedTemplate) {
        case "classic":
          return <ClassicTemplate resume={previewResume} />;
        case "modern":
          return <ModernTemplate resume={previewResume} />;
        case "minimal":
          return <MinimalTemplate resume={previewResume} />;
        case "professional":
          return <ProfessionalTemplate resume={previewResume} />;
        default:
          return <ClassicTemplate resume={previewResume} />;
      }
    })();
    
    // Add additional sections after the template, but don't include links since they're now part of the main templates
    return (
      <>
        {templateContent}
        <div className="mt-4 px-6">
          {previewResume.extracurricular && previewResume.extracurricular.length > 0 && (
            <ExtracurricularSection extracurricular={previewResume.extracurricular} />
          )}
          
          {previewResume.references && previewResume.references.length > 0 && (
            <ReferencesSection references={previewResume.references} />
          )}
          
          {previewResume.internships && previewResume.internships.length > 0 && (
            <InternshipsSection internships={previewResume.internships} />
          )}
          
          {previewResume.languages && previewResume.languages.length > 0 && (
            <LanguagesSection languages={previewResume.languages} />
          )}
          
          {previewResume.hobbies && previewResume.hobbies.length > 0 && (
            <HobbiesSection hobbies={previewResume.hobbies} />
          )}
          
          {previewResume.courses && previewResume.courses.length > 0 && (
            <CoursesSection courses={previewResume.courses} />
          )}
          
          {previewResume.projects && previewResume.projects.length > 0 && (
            <ProjectsSection projects={previewResume.projects} />
          )}
          
          {previewResume.customSections && previewResume.customSections.length > 0 && (
            <CustomSections customSections={previewResume.customSections} />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="resume-preview overflow-auto relative">
      <div className="sticky top-0 right-0 flex justify-end gap-2 p-2 z-10">
        {!resume.personal.fullName && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSample(!showSample)}
          >
            {showSample ? "Show Empty Resume" : "Show Sample Resume"}
          </Button>
        )}
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsFullscreen(true)}
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>

      {renderTemplate()}

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[850px] h-[90vh]">
          <div className="relative h-full overflow-auto bg-white p-8">
            <div className="transform scale-90 origin-top">
              {renderTemplate()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumePreview;
