import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EducationForm = () => {
  const { resume, addEducation, updateEducation, removeEducation } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id?: string
  ) => {
    const { name, value } = e.target;
    
    if (id) {
      updateEducation(id, { [name]: value });
    } else {
      setNewEducation(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    addEducation(newEducation);
    setNewEducation({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsAdding(false);
    toast({
      title: "Education added",
      description: "Your education has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeEducation(id);
    toast({
      title: "Education removed",
      description: "The education has been removed from your resume.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Existing education entries */}
      {resume.education.map((edu) => (
        <div key={edu.id} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{edu.degree}</h4>
              <p className="text-sm text-gray-500">{edu.institution}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(edu.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
              <Input
                id={`institution-${edu.id}`}
                name="institution"
                value={edu.institution}
                onChange={(e) => handleInputChange(e, edu.id)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
              <Input
                id={`degree-${edu.id}`}
                name="degree"
                value={edu.degree}
                onChange={(e) => handleInputChange(e, edu.id)}
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
            <Input
              id={`field-${edu.id}`}
              name="field"
              value={edu.field}
              onChange={(e) => handleInputChange(e, edu.id)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
              <Input
                id={`startDate-${edu.id}`}
                name="startDate"
                type="text"
                placeholder="MM/YYYY"
                value={edu.startDate}
                onChange={(e) => handleInputChange(e, edu.id)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
              <Input
                id={`endDate-${edu.id}`}
                name="endDate"
                type="text"
                placeholder="MM/YYYY"
                value={edu.endDate}
                onChange={(e) => handleInputChange(e, edu.id)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor={`description-${edu.id}`}>Description (Optional)</Label>
            <Textarea
              id={`description-${edu.id}`}
              name="description"
              value={edu.description}
              onChange={(e) => handleInputChange(e, edu.id)}
              rows={3}
            />
          </div>
        </div>
      ))}

      {/* Add new education form */}
      {isAdding ? (
        <form onSubmit={handleAddEducation} className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium mb-4">Add New Education</h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                name="institution"
                value={newEducation.institution}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                name="degree"
                value={newEducation.degree}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="field">Field of Study</Label>
            <Input
              id="field"
              name="field"
              value={newEducation.field}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="text"
                placeholder="MM/YYYY"
                value={newEducation.startDate}
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
                value={newEducation.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={newEducation.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Education</Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      )}
    </div>
  );
};

export default EducationForm;
