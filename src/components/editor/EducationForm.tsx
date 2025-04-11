
import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
    e: React.ChangeEvent<HTMLInputElement>,
    id?: string
  ) => {
    const { name, value } = e.target;
    
    if (id) {
      updateEducation(id, { [name]: value });
    } else {
      setNewEducation(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (value: string, id?: string) => {
    if (id) {
      updateEducation(id, { description: value });
    } else {
      setNewEducation(prev => ({ ...prev, description: value }));
    }
  };

  const handleDateChange = (date: Date | undefined, field: "startDate" | "endDate", id?: string) => {
    if (!date) return;
    
    const dateStr = date.toISOString();
    
    if (id) {
      const edu = resume.education.find(e => e.id === id);
      
      // If setting end date, ensure it's after start date
      if (field === "endDate" && edu?.startDate && new Date(edu.startDate) > date) {
        toast({
          title: "Invalid date selection",
          description: "End date cannot be earlier than start date.",
          variant: "destructive"
        });
        return;
      }
      
      // If setting start date, ensure it's before end date
      if (field === "startDate" && edu?.endDate && new Date(edu.endDate) < date) {
        toast({
          title: "Invalid date selection",
          description: "Start date cannot be later than end date.",
          variant: "destructive"
        });
        return;
      }
      
      updateEducation(id, { [field]: dateStr });
    } else {
      // If setting end date, ensure it's after start date
      if (field === "endDate" && newEducation.startDate && new Date(newEducation.startDate) > date) {
        toast({
          title: "Invalid date selection",
          description: "End date cannot be earlier than start date.",
          variant: "destructive"
        });
        return;
      }
      
      // If setting start date, ensure it's before end date
      if (field === "startDate" && newEducation.endDate && new Date(newEducation.endDate) < date) {
        toast({
          title: "Invalid date selection",
          description: "Start date cannot be later than end date.",
          variant: "destructive"
        });
        return;
      }
      
      setNewEducation(prev => ({ ...prev, [field]: dateStr }));
    }
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    if (!newEducation.startDate) {
      toast({
        title: "Missing start date",
        description: "Please select a start date.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEducation.endDate) {
      toast({
        title: "Missing end date",
        description: "Please select an end date.",
        variant: "destructive"
      });
      return;
    }
    
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
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={`startDate-${edu.id}`}
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !edu.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {edu.startDate ? format(new Date(edu.startDate), "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => handleDateChange(date, "startDate", edu.id)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={`endDate-${edu.id}`}
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !edu.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => handleDateChange(date, "endDate", edu.id)}
                    fromDate={edu.startDate ? new Date(edu.startDate) : undefined}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor={`description-${edu.id}`}>Description (Optional)</Label>
            <RichTextEditor
              value={edu.description}
              onChange={(value) => handleDescriptionChange(value, edu.id)}
              height={150}
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
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newEducation.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEducation.startDate ? format(new Date(newEducation.startDate), "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => handleDateChange(date, "startDate")}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newEducation.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEducation.endDate ? format(new Date(newEducation.endDate), "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => handleDateChange(date, "endDate")}
                    fromDate={newEducation.startDate ? new Date(newEducation.startDate) : undefined}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="description">Description (Optional)</Label>
            <RichTextEditor
              value={newEducation.description}
              onChange={(value) => handleDescriptionChange(value)}
              height={150}
              placeholder="Describe your academic achievements, coursework, etc..."
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
