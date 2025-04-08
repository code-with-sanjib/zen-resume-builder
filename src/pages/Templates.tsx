
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResume } from "@/contexts/ResumeContext";
import { defaultTemplates } from "@/data/templates";
import { Search } from "lucide-react";

const Templates = () => {
  const [searchParams] = useSearchParams();
  const selectedFromUrl = searchParams.get("selected");
  const navigate = useNavigate();
  const { resume, setSelectedTemplate } = useResume();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("all");
  
  const filteredTemplates = React.useMemo(() => {
    let templates = defaultTemplates;
    
    // Filter by search term
    if (searchTerm) {
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== "all") {
      templates = templates.filter(template => {
        switch (activeCategory) {
          case "modern":
            return template.isModern;
          case "minimal":
            return template.isMinimal;
          case "professional":
            return template.isProfessional;
          case "creative":
            return template.isCreative;
          default:
            return true;
        }
      });
    }
    
    return templates;
  }, [searchTerm, activeCategory]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    navigate('/editor');
  };

  React.useEffect(() => {
    if (selectedFromUrl) {
      setSelectedTemplate(selectedFromUrl);
    }
  }, [selectedFromUrl, setSelectedTemplate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Resume Templates
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Choose from our collection of professionally designed, ATS-friendly resume templates.
        </p>
      </div>
      
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search templates..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="justify-start">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="modern">Modern</TabsTrigger>
            <TabsTrigger value="minimal">Minimal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-6">
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="h-48 flex items-center justify-center"
                      style={{ backgroundColor: template.color + '10' }}
                    >
                      <span className="text-center text-xl font-medium text-gray-500">
                        {template.name} Template
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          Preview
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No templates found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Templates;
