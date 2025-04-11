
import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const ExperienceForm = () => {
  const { resume, addExperience, updateExperience, removeExperience } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id?: string
  ) => {
    const { name, value } = e.target;
    
    if (id) {
      updateExperience(id, { [name]: value });
    } else {
      setNewExperience(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (value: string, id?: string) => {
    if (id) {
      updateExperience(id, { description: value });
    } else {
      setNewExperience(prev => ({ ...prev, description: value }));
    }
  };

  const handleSwitchChange = (checked: boolean, id?: string) => {
    if (id) {
      updateExperience(id, { current: checked });
    } else {
      setNewExperience(prev => ({ ...prev, current: checked }));
    }
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    addExperience(newExperience);
    setNewExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setIsAdding(false);
    toast({
      title: "Experience added",
      description: "Your work experience has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeExperience(id);
    toast({
      title: "Experience removed",
      description: "The work experience has been removed from your resume.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Existing experiences */}
      {resume.experience.map((exp) => (
        <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{exp.position}</h4>
              <p className="text-sm text-gray-500">{exp.company}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(exp.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`company-${exp.id}`}>Company</Label>
              <Input
                id={`company-${exp.id}`}
                name="company"
                value={exp.company}
                onChange={(e) => handleInputChange(e, exp.id)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`position-${exp.id}`}>Position</Label>
              <Input
                id={`position-${exp.id}`}
                name="position"
                value={exp.position}
                onChange={(e) => handleInputChange(e, exp.id)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
              <Input
                id={`startDate-${exp.id}`}
                name="startDate"
                type="text"
                placeholder="MM/YYYY"
                value={exp.startDate}
                onChange={(e) => handleInputChange(e, exp.id)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
              <Input
                id={`endDate-${exp.id}`}
                name="endDate"
                type="text"
                placeholder="MM/YYYY"
                value={exp.endDate}
                onChange={(e) => handleInputChange(e, exp.id)}
                disabled={exp.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id={`current-${exp.id}`}
              checked={exp.current}
              onCheckedChange={(checked) => handleSwitchChange(checked, exp.id)}
            />
            <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
          </div>

          <div className="mt-4">
            <Label htmlFor={`description-${exp.id}`}>Description</Label>
            <RichTextEditor
              value={exp.description}
              onChange={(value) => handleDescriptionChange(value, exp.id)}
              height={150}
            />
          </div>
        </div>
      ))}

      {/* Add new experience form */}
      {isAdding ? (
        <form onSubmit={handleAddExperience} className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium mb-4">Add New Experience</h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={newExperience.company}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={newExperience.position}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="text"
                placeholder="MM/YYYY"
                value={newExperience.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="text"
                placeholder="MM/YYYY"
                value={newExperience.endDate}
                onChange={handleInputChange}
                disabled={newExperience.current}
                required={!newExperience.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="current"
              checked={newExperience.current}
              onCheckedChange={(checked) => handleSwitchChange(checked)}
            />
            <Label htmlFor="current">I currently work here</Label>
          </div>

          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor
              value={newExperience.description}
              onChange={(value) => handleDescriptionChange(value)}
              height={150}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Experience</Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      )}
    </div>
  );
};

export default ExperienceForm;
