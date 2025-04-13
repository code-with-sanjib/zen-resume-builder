import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Plus, Trash2, Calendar as CalendarIcon, GripVertical, Building } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const InternshipsForm = () => {
  const { resume, addInternship, updateInternship, removeInternship, reorderInternships } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newInternship, setNewInternship] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });
  
  const [datePopoverOpen, setDatePopoverOpen] = useState<{
    id?: string;
    type: "start" | "end";
  } | null>(null);

  const handleAdd = () => {
    if (!newInternship.jobTitle || !newInternship.company) {
      toast({
        title: "Missing information",
        description: "Please provide at least a job title and company name.",
        variant: "destructive",
      });
      return;
    }

    addInternship(newInternship, {});
    setNewInternship({
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setIsAdding(false);
    toast({
      title: "Internship added",
      description: "The internship has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeInternship(id);
    toast({
      title: "Internship removed",
      description: "The internship has been removed from your resume.",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(resume.internships || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    reorderInternships(items);
  };

  const handleDateChange = (date: Date | undefined, type: "start" | "end", id?: string) => {
    if (!date) return;
    
    const dateStr = date.toISOString();
    
    if (id) {
      const internship = resume.internships?.find(item => item.id === id);
      if (internship) {
        const updatedInternship = { ...internship };
        
        if (type === "start") {
          updatedInternship.startDate = dateStr;
          if (!updatedInternship.current && updatedInternship.endDate && new Date(updatedInternship.endDate) < date) {
            updatedInternship.endDate = "";
          }
        } else if (!internship.current) {
          updatedInternship.endDate = dateStr;
        }
        
        updateInternship(updatedInternship);
      }
    } else {
      if (type === "start") {
        setNewInternship({ 
          ...newInternship, 
          startDate: dateStr,
          endDate: !newInternship.current && newInternship.endDate && new Date(newInternship.endDate) < date 
            ? "" 
            : newInternship.endDate
        });
      } else if (!newInternship.current) {
        setNewInternship({ ...newInternship, endDate: dateStr });
      }
    }
    
    setDatePopoverOpen(null);
  };

  const internships = resume.internships || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Internships</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Internship
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Marketing Intern"
                  value={newInternship.jobTitle}
                  onChange={(e) => setNewInternship({ ...newInternship, jobTitle: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="company">Employer/Company</Label>
                <Input
                  id="company"
                  placeholder="Company name"
                  value={newInternship.company}
                  onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="current-job"
                  checked={newInternship.current}
                  onCheckedChange={(checked) => {
                    setNewInternship({ 
                      ...newInternship, 
                      current: checked,
                      endDate: checked ? "" : newInternship.endDate
                    });
                  }}
                />
                <Label htmlFor="current-job">I currently work here</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover
                    open={datePopoverOpen?.type === "start" && datePopoverOpen?.id === undefined}
                    onOpenChange={(open) => open 
                      ? setDatePopoverOpen({ type: "start", id: undefined }) 
                      : setDatePopoverOpen(null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !newInternship.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newInternship.startDate ? format(new Date(newInternship.startDate), "MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newInternship.startDate ? new Date(newInternship.startDate) : undefined}
                        onSelect={(date) => handleDateChange(date, "start")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {!newInternship.current && (
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <Popover
                      open={datePopoverOpen?.type === "end" && datePopoverOpen?.id === undefined}
                      onOpenChange={(open) => open 
                        ? setDatePopoverOpen({ type: "end", id: undefined }) 
                        : setDatePopoverOpen(null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !newInternship.endDate && "text-muted-foreground"
                          )}
                          disabled={!newInternship.startDate}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newInternship.endDate ? format(new Date(newInternship.endDate), "MMM yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newInternship.endDate ? new Date(newInternship.endDate) : undefined}
                          onSelect={(date) => handleDateChange(date, "end")}
                          fromDate={newInternship.startDate ? new Date(newInternship.startDate) : undefined}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                  value={newInternship.description}
                  onChange={(value) => setNewInternship({ ...newInternship, description: value })}
                  placeholder="Describe your responsibilities, achievements, and skills gained..."
                  height={200}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Internship</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {internships.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="internships-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {internships.map((internship, index) => (
                  <Draggable key={internship.id} draggableId={internship.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group"
                      >
                        <CardContent className="p-4 grid gap-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium">{internship.jobTitle}</h4>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Building className="h-3.5 w-3.5 mr-1" />
                                  {internship.company}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {internship.startDate && format(new Date(internship.startDate), "MMM yyyy")}
                                  {" - "}
                                  {internship.current ? "Present" : internship.endDate && format(new Date(internship.endDate), "MMM yyyy")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setNewInternship({...internship});
                                  setIsAdding(true);
                                  removeInternship(internship.id);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemove(internship.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="pl-7 text-sm prose prose-sm max-w-none">
                            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: internship.description }} />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {internships.length === 0 && !isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No internships added yet</p>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Internship
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InternshipsForm;
