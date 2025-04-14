
import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Plus, Trash2, Calendar as CalendarIcon, GripVertical } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const ProjectsForm = () => {
  const { resume, addProject, updateProject, removeProject, reorderProjects } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  
  const [datePopoverOpen, setDatePopoverOpen] = useState<{
    id?: string;
    type: "start" | "end";
  } | null>(null);

  const handleAdd = () => {
    if (!newProject.title) {
      toast({
        title: "Missing information",
        description: "Please provide at least a project title.",
        variant: "destructive",
      });
      return;
    }

    addProject(newProject, resume.projects || []);
    setNewProject({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    });
    setIsAdding(false);
    toast({
      title: "Project added",
      description: "The project has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeProject(id);
    toast({
      title: "Project removed",
      description: "The project has been removed from your resume.",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(resume.projects || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    reorderProjects(items);
  };
  
  const handleDateChange = (date: Date | undefined, type: "start" | "end", id?: string) => {
    if (!date) return;
    
    const dateStr = date.toISOString();
    
    if (id) {
      const project = resume.projects?.find(item => item.id === id);
      if (project) {
        const updatedProject = { ...project };
        
        if (type === "start") {
          updatedProject.startDate = dateStr;
          if (updatedProject.endDate && new Date(updatedProject.endDate) < date) {
            updatedProject.endDate = "";
          }
        } else {
          updatedProject.endDate = dateStr;
        }
        
        updateProject(updatedProject, resume.projects || []);
      }
    } else {
      if (type === "start") {
        setNewProject({ 
          ...newProject, 
          startDate: dateStr,
          endDate: newProject.endDate && new Date(newProject.endDate) < date ? "" : newProject.endDate
        });
      } else {
        setNewProject({ ...newProject, endDate: dateStr });
      }
    }
    
    setDatePopoverOpen(null);
  };
  
  const projects = resume.projects || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Projects</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. E-commerce Website"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
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
                          !newProject.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newProject.startDate ? format(new Date(newProject.startDate), "MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newProject.startDate ? new Date(newProject.startDate) : undefined}
                        onSelect={(date) => handleDateChange(date, "start")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
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
                          !newProject.endDate && "text-muted-foreground"
                        )}
                        disabled={!newProject.startDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newProject.endDate ? format(new Date(newProject.endDate), "MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newProject.endDate ? new Date(newProject.endDate) : undefined}
                        onSelect={(date) => handleDateChange(date, "end")}
                        fromDate={newProject.startDate ? new Date(newProject.startDate) : undefined}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                  value={newProject.description}
                  onChange={(value) => setNewProject({ ...newProject, description: value })}
                  placeholder="Describe the project, technologies used, and your role..."
                  height={200}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Project</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {projects.map((project, index) => (
                  <Draggable key={project.id} draggableId={project.id} index={index}>
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
                                <h4 className="font-medium">{project.title}</h4>
                                <div className="text-sm text-gray-500">
                                  {project.startDate && format(new Date(project.startDate), "MMM yyyy")}
                                  {project.startDate && project.endDate && " - "}
                                  {project.endDate && format(new Date(project.endDate), "MMM yyyy")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setNewProject({...project});
                                  setIsAdding(true);
                                  removeProject(project.id);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemove(project.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="pl-7 text-sm prose prose-sm max-w-none">
                            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: project.description }} />
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

      {projects.length === 0 && !isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No projects added yet</p>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsForm;
