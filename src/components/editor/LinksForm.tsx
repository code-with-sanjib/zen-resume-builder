
import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Trash2, GripVertical, Link as LinkIcon } from "lucide-react";

const LinksForm = () => {
  const { resume, addLink, removeLink, reorderLinks } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({
    label: "",
    url: ""
  });

  const handleAdd = () => {
    if (!newLink.label || !newLink.url) {
      toast({
        title: "Missing information",
        description: "Please provide both a label and URL.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(newLink.url);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    addLink(newLink);
    setNewLink({ label: "", url: "" });
    setIsAdding(false);
    toast({
      title: "Link added",
      description: "The link has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeLink(id);
    toast({
      title: "Link removed",
      description: "The link has been removed from your resume.",
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(resume.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderLinks(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Links</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="e.g., LinkedIn, Portfolio, Blog"
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Link</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {resume.links.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {resume.links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group"
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">{link.label}</h4>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm text-primary flex items-center hover:underline"
                              >
                                <LinkIcon className="h-3.5 w-3.5 mr-1" />
                                {link.url}
                              </a>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemove(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {resume.links.length === 0 && !isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No links added yet</p>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinksForm;
