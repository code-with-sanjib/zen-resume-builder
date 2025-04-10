
import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Plus, Trash2, GripVertical, Mail, Phone, Building } from "lucide-react";

const ReferencesForm = () => {
  const { resume, addReference, updateReference, removeReference, reorderReferences } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newReference, setNewReference] = useState({
    fullName: "",
    company: "",
    role: "",
    email: "",
    phone: "",
  });

  const handleAdd = () => {
    if (!newReference.fullName) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name for the reference.",
        variant: "destructive",
      });
      return;
    }

    addReference(newReference);
    setNewReference({
      fullName: "",
      company: "",
      role: "",
      email: "",
      phone: "",
    });
    setIsAdding(false);
    toast({
      title: "Reference added",
      description: "The reference has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeReference(id);
    toast({
      title: "Reference removed",
      description: "The reference has been removed from your resume.",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(resume.references);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    reorderReferences(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">References</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Reference
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Jane Doe"
                  value={newReference.fullName}
                  onChange={(e) => setNewReference({ ...newReference, fullName: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Company name"
                    value={newReference.company}
                    onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role/Designation</Label>
                  <Input
                    id="role"
                    placeholder="e.g. Manager, Director, etc."
                    value={newReference.role}
                    onChange={(e) => setNewReference({ ...newReference, role: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={newReference.email}
                    onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    value={newReference.phone}
                    onChange={(e) => setNewReference({ ...newReference, phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Reference</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {resume.references.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="references-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {resume.references.map((reference, index) => (
                  <Draggable key={reference.id} draggableId={reference.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group"
                      >
                        <CardContent className="p-4 grid gap-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium">{reference.fullName}</h4>
                                <div className="text-sm text-gray-500">{reference.role}</div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemove(reference.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="pl-7 grid gap-1">
                            <div className="flex items-center text-sm">
                              <Building className="h-3.5 w-3.5 mr-2 text-gray-500" />
                              {reference.company}
                            </div>
                            {reference.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                {reference.email}
                              </div>
                            )}
                            {reference.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                {reference.phone}
                              </div>
                            )}
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

      {resume.references.length === 0 && !isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No references added yet</p>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Reference
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferencesForm;
