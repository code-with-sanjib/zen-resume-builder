import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
      updateExperience(id, { 
        current: checked,
        endDate: checked ? "" : resume.experience.find(exp => exp.id === id)?.endDate || ""
      });
    } else {
      setNewExperience(prev => ({ 
        ...prev, 
        current: checked,
        endDate: checked ? "" : prev.endDate
      }));
    }
  };

  const handleDateChange = (date: Date | undefined, field: "startDate" | "endDate", id?: string) => {
    if (!date) return;
    
    const dateStr = date.toISOString();
    
    if (id) {
      const exp = resume.experience.find(e => e.id === id);
      
      if (field === "endDate" && exp?.startDate && new Date(exp.startDate) > date) {
        toast({
          title: "Invalid date selection",
          description: "End date cannot be earlier than start date.",
          variant: "destructive"
        });
        return;
      }
      
      if (field === "startDate" && exp?.endDate && !exp.current && new Date(exp.endDate) < date) {
        toast({
          title: "Invalid date selection",
          description: "Start date cannot be later than end date.",
          variant: "destructive"
        });
        return;
      }
      
      updateExperience(id, { [field]: dateStr });
    } else {
      if (field === "endDate" && newExperience.startDate && new Date(newExperience.startDate) > date) {
        toast({
          title: "Invalid date selection",
          description: "End date cannot be earlier than start date.",
          variant: "destructive"
        });
        return;
      }
      
      if (field === "startDate" && newExperience.endDate && !newExperience.current && new Date(newExperience.endDate) < date) {
        toast({
          title: "Invalid date selection",
          description: "Start date cannot be later than end date.",
          variant: "destructive"
        });
        return;
      }
      
      setNewExperience(prev => ({ ...prev, [field]: dateStr }));
    }
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExperience.startDate) {
      toast({
        title: "Missing start date",
        description: "Please select a start date.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newExperience.current && !newExperience.endDate) {
      toast({
        title: "Missing end date",
        description: "Please select an end date or mark as current position.",
        variant: "destructive"
      });
      return;
    }
    
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
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={`startDate-${exp.id}`}
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !exp.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    value={exp.startDate ? new Date(exp.startDate) : undefined}
                    onChange={(date) => handleDateChange(date as Date, "startDate", exp.id)}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={`endDate-${exp.id}`}
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !exp.endDate && "text-muted-foreground"
                    )}
                    disabled={exp.current}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    value={exp.endDate ? new Date(exp.endDate) : undefined}
                    onChange={(date) => handleDateChange(date as Date, "endDate", exp.id)}
                    disabled={exp.current}
                    minDate={exp.startDate ? new Date(exp.startDate) : undefined}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
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
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newExperience.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newExperience.startDate ? format(new Date(newExperience.startDate), "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    value={newExperience.startDate ? new Date(newExperience.startDate) : undefined}
                    onChange={(date) => handleDateChange(date as Date, "startDate")}
                    className="p-3"
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
                      !newExperience.endDate && "text-muted-foreground"
                    )}
                    disabled={newExperience.current}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newExperience.current ? "Present" : newExperience.endDate ? format(new Date(newExperience.endDate), "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    value={newExperience.endDate ? new Date(newExperience.endDate) : undefined}
                    onChange={(date) => handleDateChange(date as Date, "endDate")}
                    disabled={newExperience.current}
                    minDate={newExperience.startDate ? new Date(newExperience.startDate) : undefined}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
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
