
import { useResume } from "@/contexts/ResumeContext";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { calculatePages } from "@/components/editor/ResumeExport";

const ResumePreview = () => {
  const { resume } = useResume();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSample, setShowSample] = useState(!resume.personal.fullName);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const previewResume = showSample ? sampleResume : resume;
  
  useEffect(() => {
    const calculateTotalPages = async () => {
      const element = document.querySelector(".resume-preview-content") as HTMLElement;
      if (element) {
        const pages = await calculatePages(element);
        setTotalPages(pages);
        
        // Reset to first page when content changes
        setCurrentPage(1);
      }
    };
    
    // Allow the content to render first
    const timeoutId = setTimeout(calculateTotalPages, 200);
    return () => clearTimeout(timeoutId);
  }, [resume, showSample]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
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

  // Apply page offset styles to simulate PDF pagination in preview
  const getPageStyle = () => {
    if (totalPages <= 1) return {};
    
    // Each A4 page is approximately 1123px tall (297mm at 96 DPI)
    // We use 1050px to account for some padding
    const pageHeight = 1050;
    const offsetY = (currentPage - 1) * -pageHeight;
    
    return {
      transform: `translateY(${offsetY}px)`,
      height: totalPages > 1 ? `${totalPages * pageHeight}px` : 'auto',
    };
  };

  // Pagination controls component that can be reused in both views
  const PaginationControls = () => (
    <div className="pagination-controls mt-4 flex justify-center items-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          <PaginationItem className="flex items-center">
            <span className="text-sm mx-2">
              {currentPage} / {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );

  return (
    <div className="resume-preview overflow-hidden relative">
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

      <div className="resume-preview-content overflow-hidden" style={{ height: totalPages > 1 ? '1050px' : 'auto' }}>
        <div style={getPageStyle()}>
          {renderTemplate()}
        </div>
      </div>
      
      {/* Show pagination controls in normal view for multi-page resumes */}
      {totalPages > 1 && <PaginationControls />}

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[850px] h-[90vh]">
          <div className="relative h-full overflow-auto bg-white p-8">
            <div className="transform scale-90 origin-top">
              {renderTemplate()}
            </div>
          </div>
          
          {/* Show pagination controls in fullscreen dialog for multi-page resumes */}
          {totalPages > 1 && <PaginationControls />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumePreview;
