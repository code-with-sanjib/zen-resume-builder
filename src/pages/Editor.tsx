
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
  PanelLeft,
  Eye,
  EyeOff,
  Printer
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
  
  const getSectionTitle = () => {
    switch (activeSection) {
      case "personal": return "Personal Information";
      case "experience": return "Work Experience";
      case "education": return "Education";
      case "skills": return "Skills";
      case "extracurricular": return "Extracurricular Activities";
      case "references": return "References";
      case "internships": return "Internships";
      case "languages": return "Languages";
      case "hobbies": return "Hobbies & Interests";
      case "courses": return "Courses & Certifications";
      case "projects": return "Projects";
      case "links": return "Links";
      default: return "Personal Information";
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="h-full flex">
          {/* Editor Sidebar */}
          <EditorSidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
          
          {/* Mobile Action Bar */}
          <div className="lg:hidden fixed top-16 left-0 right-0 z-10 bg-white border-b px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-base font-medium">{getSectionTitle()}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={togglePreview}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <ResumeExport iconOnly />
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="editor-content-wrapper w-full pt-0 lg:pt-4">
            {/* Form Section */}
            <div className={`editor-form-container ${showPreview ? '' : 'w-full'} h-full p-2 sm:p-4`}>
              <Card className="h-full shadow-sm border-0 overflow-hidden">
                {/* Header with title and actions (desktop) */}
                <div className="hidden lg:flex justify-between items-center px-6 pt-6 pb-2">
                  <h2 className="text-lg font-medium text-gray-800">{getSectionTitle()}</h2>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={togglePreview}
                      className="text-gray-600 gap-1"
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
                    </Button>
                  </div>
                </div>
                
                {/* Form Content */}
                <CardContent className="p-4 lg:p-6 h-[calc(100%-4rem)] overflow-auto">
                  {renderActiveForm()}
                </CardContent>
              </Card>
            </div>
            
            {/* Preview Section */}
            {showPreview && (
              <div className="preview-container h-full p-2 sm:p-4">
                <Card className="h-full shadow-sm border-0">
                  <div className="hidden lg:flex justify-between items-center px-6 pt-6 pb-2">
                    <h2 className="text-lg font-medium text-gray-800">Resume Preview</h2>
                    <ResumeExport />
                  </div>
                  
                  <CardContent className="p-4 h-[calc(100%-4rem)] overflow-auto flex flex-col">
                    <div className="flex-1 flex justify-center items-center">
                      <div className="transform scale-75 sm:scale-80 md:scale-85 lg:scale-90 xl:scale-95 2xl:scale-100 origin-top">
                        <ResumePreview />
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
}

const EditorSidebar = ({ activeSection, setActiveSection }: EditorSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();

  const menuItems = [
    { id: "personal", label: "Personal", icon: <User className="w-4 h-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "skills", label: "Skills", icon: <Code className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FolderKanban className="w-4 h-4" /> },
    { id: "courses", label: "Courses", icon: <Bookmark className="w-4 h-4" /> },
    { id: "extracurricular", label: "Activities", icon: <Award className="w-4 h-4" /> },
    { id: "internships", label: "Internships", icon: <BookOpen className="w-4 h-4" /> },
    { id: "languages", label: "Languages", icon: <Languages className="w-4 h-4" /> },
    { id: "hobbies", label: "Hobbies", icon: <Heart className="w-4 h-4" /> },
    { id: "references", label: "References", icon: <Users className="w-4 h-4" /> },
    { id: "links", label: "Links", icon: <LinkIcon className="w-4 h-4" /> },
  ];

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-0 shadow-sm bg-white"
      variant={isMobile ? "floating" : "sidebar"}
    >
      <SidebarHeader className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-primary mr-2" />
          <span className="font-semibold text-base">Resume Builder</span>
        </div>
        <SidebarTrigger className="ml-2 text-gray-500 hover:text-gray-700" />
      </SidebarHeader>
      
      <SidebarContent className="py-4">
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
      
      <SidebarFooter className="p-4 border-t">
        <Link to="/templates">
          <Button 
            variant="outline" 
            size={isCollapsed ? "icon" : "default"} 
            className={`w-full ${!isCollapsed ? 'justify-start' : ''}`}
          >
            <FileText className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Change Template</span>}
          </Button>
        </Link>
        <div className="mt-4">
          <ResumeExport 
            iconOnly={isCollapsed} 
            className={`w-full ${!isCollapsed ? 'justify-start' : ''}`}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Editor;
