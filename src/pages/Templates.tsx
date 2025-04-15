
import { useNavigate } from "react-router-dom";
import { useResume } from "@/contexts/ResumeContext";
import { defaultTemplates } from "@/data/templates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import ClassicTemplate from "@/components/resume/ClassicTemplate";
import ModernTemplate from "@/components/resume/ModernTemplate";
import MinimalTemplate from "@/components/resume/MinimalTemplate";
import ProfessionalTemplate from "@/components/resume/ProfessionalTemplate";
import { sampleResume } from "@/data/sampleResume";
import { FileText } from "lucide-react";

const Templates = () => {
  const navigate = useNavigate();
  const { setSelectedTemplate } = useResume();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    navigate("/editor");
  };

  const renderPreview = () => {
    switch (previewTemplate) {
      case "classic":
        return <ClassicTemplate resume={sampleResume} />;
      case "modern":
        return <ModernTemplate resume={sampleResume} />;
      case "minimal":
        return <MinimalTemplate resume={sampleResume} />;
      case "professional":
        return <ProfessionalTemplate resume={sampleResume} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Resume Templates</h1>
        <p className="text-gray-600 mb-8">
          Choose a template to start building your professional resume
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-[3/4] relative group">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    onClick={() => setPreviewTemplate(template.id)}
                  >
                    Preview
                  </Button>
                  <Button onClick={() => handleTemplateSelect(template.id)}>
                    Use Template
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-[850px] h-[90vh]">
            <div className="relative h-full overflow-auto bg-white p-8">
              <div className="transform scale-90 origin-top">
                {renderPreview()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Templates;
