
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PersonalInfoForm from "@/components/editor/PersonalInfoForm";
import ExperienceForm from "@/components/editor/ExperienceForm";
import EducationForm from "@/components/editor/EducationForm";
import SkillsForm from "@/components/editor/SkillsForm";
import ResumePreview from "@/components/resume/ResumePreview";
import ResumeExport from "@/components/editor/ResumeExport";
import { useResume } from "@/contexts/ResumeContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileSparkles } from "lucide-react";

const Editor = () => {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const { resume } = useResume();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Editor Section */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Resume Editor</h1>
            <Link to="/templates">
              <Button variant="outline" size="sm">
                <FileSparkles className="mr-2 h-4 w-4" />
                Change Template
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <PersonalInfoForm />
                </TabsContent>
                
                <TabsContent value="experience">
                  <ExperienceForm />
                </TabsContent>
                
                <TabsContent value="education">
                  <EducationForm />
                </TabsContent>
                
                <TabsContent value="skills">
                  <SkillsForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview Section */}
        <div className="w-full lg:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Resume Preview</h2>
            <ResumeExport />
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg flex justify-center min-h-[842px]">
            <div className="transform scale-[0.8] origin-top">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
