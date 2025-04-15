import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  ChevronDown, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar as CalendarIcon, 
  GripVertical,
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link
} from "lucide-react";

const CustomSectionsForm = () => {
  const { resume, addCustomSection, updateCustomSection, removeCustomSection, 
          addCustomSectionItem, updateCustomSectionItem, removeCustomSectionItem, 
          reorderCustomSectionItems } = useResume();
  const { toast } = useToast();
  
  const [isAddingSectionName, setIsAddingSectionName] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");
  
  const [addingItemToSectionId, setAddingItemToSectionId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      addCustomSection(newSectionName);
      setNewSectionName("");
      setIsAddingSectionName(false);
      toast({
        title: "Section added",
        description: `Custom section "${newSectionName}" has been added.`,
      });
    }
  };

  const handleUpdateSectionName = (sectionId: string) => {
    if (editingSectionName.trim()) {
      updateCustomSection(sectionId, editingSectionName);
      setEditingSectionId(null);
      setEditingSectionName("");
      toast({
        title: "Section updated",
        description: "Section name has been updated.",
      });
    }
  };

  const handleRemoveSection = (sectionId: string, sectionTitle: string) => {
    removeCustomSection(sectionId);
    toast({
      title: "Section removed",
      description: `Custom section "${sectionTitle}" has been removed.`,
    });
  };

  const handleAddItem = (sectionId: string) => {
    if (newItem.title.trim()) {
      addCustomSectionItem(sectionId, {
        ...newItem,
        title: newItem.title.trim()
      });
      
      setNewItem({
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      
      setAddingItemToSectionId(null);
      
      toast({
        title: "Item added",
        description: "New item has been added to the section.",
      });
    }
  };

  const handleUpdateItem = (sectionId: string, itemId: string, field: string, value: string) => {
    updateCustomSectionItem(sectionId, itemId, { [field]: value });
  };

  const handleRemoveItem = (sectionId: string, itemId: string, itemTitle: string) => {
    removeCustomSectionItem(sectionId, itemId);
    toast({
      title: "Item removed",
      description: `Item "${itemTitle}" has been removed.`,
    });
  };

  const handleDateChange = (sectionId: string, itemId: string, field: string, date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM");
      updateCustomSectionItem(sectionId, itemId, { [field]: formattedDate });
    }
  };

  const formatDisplayDate = (dateString: string | undefined) => {
    if (!dateString) return "MM / YYYY";
    try {
      const [year, month] = dateString.split('-');
      return `${month} / ${year}`;
    } catch {
      return dateString;
    }
  };

  const handleDragEnd = (result: any, sectionId: string) => {
    if (!result.destination) return;

    const items = Array.from(resume.customSections?.find(s => s.id === sectionId)?.items || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderCustomSectionItems(sectionId, items);
  };

  return (
    <div className="space-y-6">
      {resume.customSections && resume.customSections.length > 0 && (
        <div className="space-y-6">
          {resume.customSections.map((section) => (
            <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                {editingSectionId === section.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingSectionName}
                      onChange={(e) => setEditingSectionName(e.target.value)}
                      className="w-48"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateSectionName(section.id)}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                )}
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingSectionId(section.id);
                      setEditingSectionName(section.title);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSection(section.id, section.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <DragDropContext onDragEnd={(result) => handleDragEnd(result, section.id)}>
                    <Droppable droppableId={`section-${section.id}`}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {section.items && section.items.length > 0 ? section.items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="border border-gray-200 rounded-lg"
                                >
                                  <Collapsible className="overflow-hidden">
                                    <div className="flex items-center bg-gray-50 p-4 rounded-t-lg">
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="mr-2 text-gray-400 hover:text-gray-600 cursor-move"
                                      >
                                        <GripVertical className="h-5 w-5" />
                                      </div>
                                      
                                      <CollapsibleTrigger className="flex items-center justify-between w-full">
                                        <span className="font-medium">{item.title || "(Not specified)"}</span>
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                      </CollapsibleTrigger>
                                      
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-2"
                                        onClick={() => handleRemoveItem(section.id, item.id, item.title)}
                                      >
                                        <X className="h-4 w-4 text-gray-500" />
                                      </Button>
                                    </div>
                                    
                                    <CollapsibleContent className="p-4 bg-white space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`item-${item.id}-title`} className="text-gray-600">
                                          Activity name, job title, book title etc.
                                        </Label>
                                        <Input
                                          id={`item-${item.id}-title`}
                                          value={item.title}
                                          onChange={(e) => handleUpdateItem(section.id, item.id, "title", e.target.value)}
                                          placeholder="Activity name, job title, book title, etc."
                                          className="border-b-2 border-primary border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0"
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor={`item-${item.id}-location`} className="text-gray-600">City</Label>
                                        <Input
                                          id={`item-${item.id}-location`}
                                          value={item.location || ""}
                                          onChange={(e) => handleUpdateItem(section.id, item.id, "location", e.target.value)}
                                          placeholder="City, Country, etc."
                                          className="border-b-2 border-primary border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0"
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label className="text-gray-600">Start & End Date</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <Button
                                                variant="outline"
                                                className={cn(
                                                  "w-full justify-start text-left font-normal bg-gray-50",
                                                  !item.startDate && "text-gray-400"
                                                )}
                                              >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formatDisplayDate(item.startDate)}
                                              </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                              <Calendar
                                                value={item.startDate ? new Date(item.startDate) : undefined}
                                                onChange={(date) => {
                                                  if (date instanceof Date) {
                                                    handleDateChange(section.id, item.id, "startDate", date);
                                                  }
                                                }}
                                                className="p-3"
                                              />
                                            </PopoverContent>
                                          </Popover>
                                          
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <Button
                                                variant="outline"
                                                className={cn(
                                                  "w-full justify-start text-left font-normal bg-gray-50",
                                                  !item.endDate && "text-gray-400"
                                                )}
                                              >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formatDisplayDate(item.endDate)}
                                              </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                              <Calendar
                                                value={item.endDate ? new Date(item.endDate) : undefined}
                                                onChange={(date) => {
                                                  if (date instanceof Date) {
                                                    handleDateChange(section.id, item.id, "endDate", date);
                                                  }
                                                }}
                                                className="p-3"
                                              />
                                            </PopoverContent>
                                          </Popover>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor={`item-${item.id}-description`} className="text-gray-600">
                                          Description
                                        </Label>
                                        <div className="border rounded-md">
                                          <div className="flex items-center border-b p-2 gap-1 bg-gray-50">
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                              <Bold className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                              <Italic className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                              <Underline className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                              <Strikethrough className="h-4 w-4" />
                                            </Button>
                                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                              <List className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                              <ListOrdered className="h-4 w-4" />
                                            </Button>
                                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                              <Link className="h-4 w-4" />
                                            </Button>
                                          </div>
                                          <Textarea
                                            id={`item-${item.id}-description`}
                                            value={item.description || ""}
                                            onChange={(e) => handleUpdateItem(section.id, item.id, "description", e.target.value)}
                                            placeholder="Enter a description..."
                                            rows={6}
                                            className="border-0 rounded-none focus-visible:ring-0 resize-none"
                                          />
                                        </div>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              )}
                            </Draggable>
                          )) : (
                            <div className="text-center text-gray-500 py-8">
                              No items in this section yet
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAddingItemToSectionId(section.id)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item to {section.title}
                  </Button>
                  
                  {addingItemToSectionId === section.id && (
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Add New Item</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setAddingItemToSectionId(null);
                            setNewItem({
                              title: "",
                              location: "",
                              startDate: "",
                              endDate: "",
                              description: "",
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-item-title" className="text-gray-600">
                          Activity name, job title, book title etc.
                        </Label>
                        <Input
                          id="new-item-title"
                          value={newItem.title}
                          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                          placeholder="Activity name, job title, book title, etc."
                          className="border-b-2 border-primary border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-item-location" className="text-gray-600">City</Label>
                        <Input
                          id="new-item-location"
                          value={newItem.location}
                          onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                          placeholder="City, Country, etc."
                          className="border-b-2 border-primary border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-600">Start & End Date</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-gray-50",
                                  !newItem.startDate && "text-gray-400"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatDisplayDate(newItem.startDate)}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                value={newItem.startDate ? new Date(newItem.startDate) : undefined}
                                onChange={(date) => {
                                  if (date instanceof Date) {
                                    setNewItem({
                                      ...newItem,
                                      startDate: format(date, "yyyy-MM")
                                    });
                                  }
                                }}
                                className="p-3"
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-gray-50",
                                  !newItem.endDate && "text-gray-400"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatDisplayDate(newItem.endDate)}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                value={newItem.endDate ? new Date(newItem.endDate) : undefined}
                                onChange={(date) => {
                                  if (date instanceof Date) {
                                    setNewItem({
                                      ...newItem,
                                      endDate: format(date, "yyyy-MM")
                                    });
                                  }
                                }}
                                className="p-3"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-item-description" className="text-gray-600">
                          Description
                        </Label>
                        <div className="border rounded-md">
                          <div className="flex items-center border-b p-2 gap-1 bg-gray-50">
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Bold className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Italic className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Underline className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Strikethrough className="h-4 w-4" />
                            </Button>
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <List className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <ListOrdered className="h-4 w-4" />
                            </Button>
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Link className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea
                            id="new-item-description"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Enter a description..."
                            rows={6}
                            className="border-0 rounded-none focus-visible:ring-0 resize-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button onClick={() => handleAddItem(section.id)}>
                          Add Item
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isAddingSectionName ? (
        <div className="p-4 border border-gray-200 rounded-lg space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Add New Section</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsAddingSectionName(false);
                setNewSectionName("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section-name" className="text-gray-600">Section Name</Label>
            <Input
              id="section-name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Projects, Certifications, Languages, etc."
              className="border-b-2 border-primary border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0"
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <Button onClick={handleAddSection}>
              Add Section
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setIsAddingSectionName(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Custom Section
        </Button>
      )}
    </div>
  );
};

export default CustomSectionsForm;
