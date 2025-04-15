
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PersonalInfoForm from "@/components/editor/PersonalInfoForm";
import ExperienceForm from "@/components/editor/ExperienceForm";
import EducationForm from "@/components/editor/EducationForm";
import SkillsForm from "@/components/editor/SkillsForm";
import ExtracurricularForm from "@/components/editor/ExtracurricularForm";
import ReferencesForm from "@/components/editor/ReferencesForm";
import InternshipsForm from "@/components/editor/InternshipsForm";
import LanguagesForm from "@/components/editor/LanguagesForm";
import HobbiesForm from "@/components/editor/HobbiesForm";
import CoursesForm from "@/components/editor/CoursesForm";
import ProjectsForm from "@/components/editor/ProjectsForm";
import LinksForm from "@/components/editor/LinksForm";
import ResumePreview from "@/components/resume/ResumePreview";
import ResumeExport from "@/components/editor/ResumeExport";
import { useResume } from "@/contexts/ResumeContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  Award,
  Users,
  BookOpen,
  Languages,
  Heart,
  Bookmark,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Editor = () => {
  const [activeSection, setActiveSection] = useState<string>("personal");
  const { resume } = useResume();
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(!isMobile);

  const renderActiveForm = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfoForm />;
      case "experience":
        return <ExperienceForm />;
      case "education":
        return <EducationForm />;
      case "skills":
        return <SkillsForm />;
      case "extracurricular":
        return <ExtracurricularForm />;
      case "references":
        return <ReferencesForm />;
      case "internships":
        return <InternshipsForm />;
      case "languages":
        return <LanguagesForm />;
      case "hobbies":
        return <HobbiesForm />;
      case "courses":
        return <CoursesForm />;
      case "projects":
        return <ProjectsForm />;
      case "links":
        return <LinksForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-[1600px] mx-auto p-2 sm:p-4 lg:p-6 flex flex-col">
        {/* Mobile Action Bar */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold">Resume Builder</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={togglePreview}
            >
              {showPreview ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Button>
            <ResumeExport iconOnly />
          </div>
        </div>
        
        <div className="flex flex-1 flex-col lg:flex-row gap-4 h-full">
          {/* Sidebar Navigation */}
          <div className="flex lg:flex-col lg:w-64 bg-white rounded-lg shadow-sm p-1 lg:p-0">
            <div className="hidden lg:block px-4 py-6 border-b">
              <h2 className="text-xl font-bold">Resume Editor</h2>
              <p className="text-sm text-gray-500 mt-1">Build your professional resume</p>
            </div>
            
            <div className="flex flex-row lg:flex-col flex-1 overflow-x-auto lg:overflow-x-visible">
              <NavItem 
                id="personal" 
                label="Personal" 
                icon={<User className="w-4 h-4" />}
                active={activeSection === "personal"} 
                onClick={() => setActiveSection("personal")}
                isMobile={isMobile}
              />
              <NavItem 
                id="experience" 
                label="Experience" 
                icon={<Briefcase className="w-4 h-4" />}
                active={activeSection === "experience"} 
                onClick={() => setActiveSection("experience")}
                isMobile={isMobile}
              />
              <NavItem 
                id="education" 
                label="Education" 
                icon={<GraduationCap className="w-4 h-4" />}
                active={activeSection === "education"} 
                onClick={() => setActiveSection("education")}
                isMobile={isMobile}
              />
              <NavItem 
                id="skills" 
                label="Skills" 
                icon={<Code className="w-4 h-4" />}
                active={activeSection === "skills"} 
                onClick={() => setActiveSection("skills")}
                isMobile={isMobile}
              />
              <NavItem 
                id="extracurricular" 
                label="Activities" 
                icon={<Award className="w-4 h-4" />}
                active={activeSection === "extracurricular"} 
                onClick={() => setActiveSection("extracurricular")}
                isMobile={isMobile}
              />
              <NavItem 
                id="references" 
                label="References" 
                icon={<Users className="w-4 h-4" />}
                active={activeSection === "references"} 
                onClick={() => setActiveSection("references")}
                isMobile={isMobile}
              />
              <NavItem 
                id="internships" 
                label="Internships" 
                icon={<BookOpen className="w-4 h-4" />}
                active={activeSection === "internships"} 
                onClick={() => setActiveSection("internships")}
                isMobile={isMobile}
              />
              <NavItem 
                id="languages" 
                label="Languages" 
                icon={<Languages className="w-4 h-4" />}
                active={activeSection === "languages"} 
                onClick={() => setActiveSection("languages")}
                isMobile={isMobile}
              />
              <NavItem 
                id="hobbies" 
                label="Hobbies" 
                icon={<Heart className="w-4 h-4" />}
                active={activeSection === "hobbies"} 
                onClick={() => setActiveSection("hobbies")}
                isMobile={isMobile}
              />
              <NavItem 
                id="courses" 
                label="Courses" 
                icon={<Bookmark className="w-4 h-4" />}
                active={activeSection === "courses"} 
                onClick={() => setActiveSection("courses")}
                isMobile={isMobile}
              />
              <NavItem 
                id="projects" 
                label="Projects" 
                icon={<FolderKanban className="w-4 h-4" />}
                active={activeSection === "projects"} 
                onClick={() => setActiveSection("projects")}
                isMobile={isMobile}
              />
              <NavItem 
                id="links" 
                label="Links" 
                icon={<LinkIcon className="w-4 h-4" />}
                active={activeSection === "links"} 
                onClick={() => setActiveSection("links")}
                isMobile={isMobile}
              />
            </div>
            
            <div className="hidden lg:flex flex-col gap-2 p-4 border-t">
              <Link to="/templates">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Change Template
                </Button>
              </Link>
              <ResumeExport />
            </div>
          </div>
          
          {/* Main Content */}
          <div className={`flex-1 ${showPreview ? 'lg:max-w-[50%]' : 'w-full'}`}>
            <Card className="h-full shadow-sm">
              <CardContent className="p-4 sm:p-6 h-full overflow-auto">
                <div className="hidden lg:flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {activeSection === "personal" && "Personal Information"}
                    {activeSection === "experience" && "Work Experience"}
                    {activeSection === "education" && "Education"}
                    {activeSection === "skills" && "Skills"}
                    {activeSection === "extracurricular" && "Extracurricular Activities"}
                    {activeSection === "references" && "References"}
                    {activeSection === "internships" && "Internships"}
                    {activeSection === "languages" && "Languages"}
                    {activeSection === "hobbies" && "Hobbies & Interests"}
                    {activeSection === "courses" && "Courses & Certifications"}
                    {activeSection === "projects" && "Projects"}
                    {activeSection === "links" && "Links"}
                  </h3>
                  
                  {isMobile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={togglePreview}
                    >
                      {showPreview ? "Hide Preview" : "Show Preview"}
                      {showPreview ? <ChevronRight className="ml-2 w-4 h-4" /> : <ChevronLeft className="ml-2 w-4 h-4" />}
                    </Button>
                  )}
                </div>
                
                {renderActiveForm()}
              </CardContent>
            </Card>
          </div>
          
          {/* Preview Section */}
          {showPreview && (
            <div className="lg:w-1/2 flex flex-col">
              <div className="hidden lg:flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Resume Preview</h2>
                <ResumeExport />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col">
                <div className="flex-1 flex justify-center items-center p-4 overflow-auto">
                  <div className="transform scale-75 sm:scale-80 md:scale-85 lg:scale-90 xl:scale-95 2xl:scale-100 origin-top">
                    <ResumePreview />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  isMobile: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ id, label, icon, active, onClick, isMobile }) => {
  return (
    <button
      className={`flex items-center px-3 py-2 lg:px-4 lg:py-3 rounded-md transition-colors whitespace-nowrap ${
        active 
          ? "bg-primary/10 text-primary" 
          : "text-gray-600 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className={`${isMobile ? "hidden" : "ml-3"} lg:ml-3 lg:block`}>{label}</span>
    </button>
  );
};

export default Editor;
