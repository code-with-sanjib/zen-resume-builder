
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
import { Plus, Trash2, Calendar as CalendarIcon, GripVertical, School, Link as LinkIcon } from "lucide-react";

const CoursesForm = () => {
  const { resume, addCourse, updateCourse, removeCourse, reorderCourses } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    institution: "",
    startDate: "",
    endDate: "",
    certificateLink: "",
  });

  const handleAdd = () => {
    if (!newCourse.name) {
      toast({
        title: "Missing information",
        description: "Please provide at least a course name.",
        variant: "destructive",
      });
      return;
    }

    addCourse(newCourse);
    setNewCourse({
      name: "",
      institution: "",
      startDate: "",
      endDate: "",
      certificateLink: "",
    });
    setIsAdding(false);
    toast({
      title: "Course added",
      description: "The course has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeCourse(id);
    toast({
      title: "Course removed",
      description: "The course has been removed from your resume.",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(resume.courses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    reorderCourses(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Courses & Certifications</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Web Development Bootcamp"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="institution">Institution or Platform</Label>
                <Input
                  id="institution"
                  placeholder="e.g. Coursera, Udemy, etc."
                  value={newCourse.institution}
                  onChange={(e) => setNewCourse({ ...newCourse, institution: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !newCourse.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCourse.startDate ? format(new Date(newCourse.startDate), "MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        onSelect={(date) => 
                          date && setNewCourse({ ...newCourse, startDate: date.toISOString() })
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !newCourse.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCourse.endDate ? format(new Date(newCourse.endDate), "MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        onSelect={(date) => 
                          date && setNewCourse({ ...newCourse, endDate: date.toISOString() })
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="certificateLink">Certificate Link (Optional)</Label>
                <Input
                  id="certificateLink"
                  type="url"
                  placeholder="https://example.com/certificate"
                  value={newCourse.certificateLink}
                  onChange={(e) => setNewCourse({ ...newCourse, certificateLink: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Course</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {resume.courses.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="courses-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {resume.courses.map((course, index) => (
                  <Draggable key={course.id} draggableId={course.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium">{course.name}</h4>
                                <div className="flex items-center text-sm text-gray-500">
                                  <School className="h-3.5 w-3.5 mr-1" />
                                  {course.institution}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {course.startDate && format(new Date(course.startDate), "MMM yyyy")}
                                  {course.startDate && course.endDate && " - "}
                                  {course.endDate && format(new Date(course.endDate), "MMM yyyy")}
                                </div>
                                {course.certificateLink && (
                                  <a 
                                    href={course.certificateLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center text-sm text-primary mt-1 hover:underline"
                                  >
                                    <LinkIcon className="h-3.5 w-3.5 mr-1" />
                                    Certificate
                                  </a>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemove(course.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {resume.courses.length === 0 && !isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No courses or certifications added yet</p>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoursesForm;
