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

const ExtracurricularForm = () => {
  const { resume, addExtracurricular, updateExtracurricular, removeExtracurricular, reorderExtracurricular } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  
  const [datePopoverOpen, setDatePopoverOpen] = useState<{
    id?: string;
    type: "start" | "end";
  } | null>(null);

  const handleAdd = () => {
    if (!newActivity.title) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title for the activity.",
        variant: "destructive",
      });
      return;
    }

    addExtracurricular(newActivity);
    setNewActivity({
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsAdding(false);
    toast({
      title: "Activity added",
      description: "The activity has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeExtracurricular(id);
    toast({
      title: "Activity removed",
      description: "The activity has been removed from your resume.",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(resume.extracurricular || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    reorderExtracurricular(items);
  };
  
  const handleDateChange = (date: Date | undefined, type: "start" | "end", id?: string) => {
    if (!date) return;
    
    const dateStr = date.toISOString();
    
    if (id) {
      const activity = resume.extracurricular?.find(item => item.id === id);
      if (activity) {
        const updatedActivity = { ...activity };
        
        if (type === "start") {
          updatedActivity.startDate = dateStr;
          if (updatedActivity.endDate && new Date(updatedActivity.endDate) < date) {
            updatedActivity.endDate = "";
          }
        } else {
          updatedActivity.endDate = dateStr;
        }
        
        updateExtracurricular(updatedActivity.id, updatedActivity);
      }
    } else {
      if (type === "start") {
        setNewActivity({ 
          ...newActivity, 
          startDate: dateStr,
          endDate: newActivity.endDate && new Date(newActivity.endDate) < date ? "" : newActivity.endDate
        });
      } else {
        setNewActivity({ ...newActivity, endDate: dateStr });
      }
    }
    
    setDatePopoverOpen(null);
  };
  
  const activities = resume.extracurricular || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Extracurricular Activities</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Activity Title</Label>
                <Input
                  id="title"
                  placeholder="Sports Team, Club, Volunteer Work, etc."
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
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
                          !newActivity.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newActivity.startDate ? format(new Date(newActivity.startDate), "MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        value={newActivity.startDate ? new Date(newActivity.startDate) : undefined}
                        onChange={(date) => handleDateChange(date as Date, "start")}
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
                          !newActivity.endDate && "text-muted-foreground"
                        )}
                        disabled={!newActivity.startDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newActivity.endDate ? format(new Date(newActivity.endDate), "MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        value={newActivity.endDate ? new Date(newActivity.endDate) : undefined}
                        onChange={(date) => handleDateChange(date as Date, "end")}
                        minDate={newActivity.startDate ? new Date(newActivity.startDate) : undefined}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                  value={newActivity.description}
                  onChange={(value) => setNewActivity({ ...newActivity, description: value })}
                  placeholder="Describe your activities, responsibilities, and achievements..."
                  height={200}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Activity</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activities.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="extracurricular-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {activities.map((activity, index) => (
                  <Draggable key={activity.id} draggableId={activity.id} index={index}>
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
                                <h4 className="font-medium">{activity.title}</h4>
                                <div className="text-sm text-gray-500">
                                  {activity.startDate && format(new Date(activity.startDate), "MMM yyyy")}
                                  {activity.startDate && activity.endDate && " - "}
                                  {activity.endDate && format(new Date(activity.endDate), "MMM yyyy")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setNewActivity({...activity});
                                  setIsAdding(true);
                                  removeExtracurricular(activity.id);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemove(activity.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="pl-7 text-sm prose prose-sm max-w-none">
                            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: activity.description }} />
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

      {activities.length === 0 && !isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No extracurricular activities added yet</p>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExtracurricularForm;
