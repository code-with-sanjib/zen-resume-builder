
import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Plus, Trash2, GripVertical, Heart } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

const HobbiesForm = () => {
  const { resume, addHobby, updateHobby, removeHobby, reorderHobbies } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newHobby, setNewHobby] = useState({
    description: "",
  });

  const handleAdd = () => {
    if (!newHobby.description) {
      toast({
        title: "Missing information",
        description: "Please provide a description for your hobby.",
        variant: "destructive",
      });
      return;
    }

    addHobby(newHobby);
    setNewHobby({
      description: "",
    });
    setIsAdding(false);
    toast({
      title: "Hobby added",
      description: "The hobby has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeHobby(id);
    toast({
      title: "Hobby removed",
      description: "The hobby has been removed from your resume.",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(resume.hobbies || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    reorderHobbies(items);
  };

  // Ensure hobbies is an array even if it's undefined
  const hobbies = resume.hobbies || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Hobbies & Interests</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Hobby
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <MDEditor
                  value={newHobby.description}
                  onChange={(value) => setNewHobby({ ...newHobby, description: value || "" })}
                  preview="edit"
                  height={200}
                  textareaProps={{
                    placeholder: "e.g. Photography, Reading, Hiking, etc. You can use **markdown** for formatting!"
                  }}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Hobby</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hobbies.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="hobbies-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {hobbies.map((hobby, index) => (
                  <Draggable key={hobby.id} draggableId={hobby.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-2 text-gray-500" />
                                <div>{hobby.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setNewHobby({...hobby});
                                  setIsAdding(true);
                                  removeHobby(hobby.id);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemove(hobby.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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

      {hobbies.length === 0 && !isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No hobbies or interests added yet</p>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Hobby
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HobbiesForm;
