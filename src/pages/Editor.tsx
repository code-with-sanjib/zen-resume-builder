
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
  Link as LinkIcon,
  PanelLeft
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";

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
      <SidebarProvider defaultOpen={true}>
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
            {/* Editor Sidebar */}
            <EditorSidebar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
              isMobile={isMobile} 
            />
            
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
      </SidebarProvider>
    </div>
  );
};

// Separated EditorSidebar component
interface EditorSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobile: boolean;
}

const EditorSidebar = ({ activeSection, setActiveSection, isMobile }: EditorSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = [
    { id: "personal", label: "Personal", icon: <User className="w-4 h-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "skills", label: "Skills", icon: <Code className="w-4 h-4" /> },
    { id: "extracurricular", label: "Activities", icon: <Award className="w-4 h-4" /> },
    { id: "references", label: "References", icon: <Users className="w-4 h-4" /> },
    { id: "internships", label: "Internships", icon: <BookOpen className="w-4 h-4" /> },
    { id: "languages", label: "Languages", icon: <Languages className="w-4 h-4" /> },
    { id: "hobbies", label: "Hobbies", icon: <Heart className="w-4 h-4" /> },
    { id: "courses", label: "Courses", icon: <Bookmark className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FolderKanban className="w-4 h-4" /> },
    { id: "links", label: "Links", icon: <LinkIcon className="w-4 h-4" /> },
  ];

  return (
    <Sidebar collapsible="icon" className="border-0">
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-primary mr-2" />
          <span className="font-bold text-lg">Resume Editor</span>
        </div>
        <SidebarTrigger className="ml-2" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
                tooltip={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Link to="/templates">
          <Button variant="outline" size={isCollapsed ? "icon" : "default"} className="w-full">
            <FileText className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Change Template</span>}
          </Button>
        </Link>
        <div className="mt-2">
          <ResumeExport iconOnly={isCollapsed} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Editor;
