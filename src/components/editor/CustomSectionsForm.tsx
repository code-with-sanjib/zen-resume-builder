import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, Trash2, Edit, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const CustomSectionsForm = () => {
  const { resume, addCustomSection, updateCustomSection, removeCustomSection, 
          addCustomSectionItem, updateCustomSectionItem, removeCustomSectionItem } = useResume();
  const { toast } = useToast();
  
  const [isAddingSectionName, setIsAddingSectionName] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");
  
  // Track which section is currently adding a new item
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
      
      // Reset form
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
    if (!dateString) return "";
    try {
      const [year, month] = dateString.split('-');
      return `${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing custom sections */}
      {resume.customSections.length > 0 && (
        <Accordion type="multiple" className="space-y-4">
          {resume.customSections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {editingSectionId === section.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingSectionName}
                          onChange={(e) => setEditingSectionName(e.target.value)}
                          className="w-48"
                        />
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateSectionName(section.id);
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <span>{section.title}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSectionId(section.id);
                        setEditingSectionName(section.title);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSection(section.id, section.title);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                {/* Items in this section */}
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <Collapsible key={item.id} className="border border-gray-100 rounded-md overflow-hidden">
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100">
                        <span>{item.title || "(Not specified)"}</span>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`item-${item.id}-title`}>Title</Label>
                          <Input
                            id={`item-${item.id}-title`}
                            value={item.title}
                            onChange={(e) => handleUpdateItem(section.id, item.id, "title", e.target.value)}
                            placeholder="Activity name, job title, book title, etc."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`item-${item.id}-location`}>Location</Label>
                          <Input
                            id={`item-${item.id}-location`}
                            value={item.location || ""}
                            onChange={(e) => handleUpdateItem(section.id, item.id, "location", e.target.value)}
                            placeholder="City, Country, etc."
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !item.startDate && "text-muted-foreground"
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {item.startDate ? formatDisplayDate(item.startDate) : <span>MM/YYYY</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={item.startDate ? new Date(item.startDate) : undefined}
                                  onSelect={(date) => handleDateChange(section.id, item.id, "startDate", date)}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                  captionLayout="dropdown-buttons"
                                  fromYear={1990}
                                  toYear={2030}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !item.endDate && "text-muted-foreground"
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {item.endDate ? formatDisplayDate(item.endDate) : <span>MM/YYYY</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={item.endDate ? new Date(item.endDate) : undefined}
                                  onSelect={(date) => handleDateChange(section.id, item.id, "endDate", date)}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                  captionLayout="dropdown-buttons"
                                  fromYear={1990}
                                  toYear={2030}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`item-${item.id}-description`}>Description</Label>
                          <Textarea
                            id={`item-${item.id}-description`}
                            value={item.description || ""}
                            onChange={(e) => handleUpdateItem(section.id, item.id, "description", e.target.value)}
                            placeholder="Enter a description..."
                            rows={5}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(section.id, item.id, item.title)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
                
                {/* Add new item */}
                {addingItemToSectionId === section.id ? (
                  <div className="mt-4 p-4 border border-gray-200 rounded-md space-y-4">
                    <h4 className="font-medium">Add New Item</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-item-title">Title</Label>
                      <Input
                        id="new-item-title"
                        value={newItem.title}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        placeholder="Activity name, job title, book title, etc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-item-location">Location</Label>
                      <Input
                        id="new-item-location"
                        value={newItem.location}
                        onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                        placeholder="City, Country, etc."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newItem.startDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {newItem.startDate ? formatDisplayDate(newItem.startDate) : <span>MM/YYYY</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={newItem.startDate ? new Date(newItem.startDate) : undefined}
                              onSelect={(date) => date && setNewItem({
                                ...newItem,
                                startDate: format(date, "yyyy-MM")
                              })}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                              captionLayout="dropdown-buttons"
                              fromYear={1990}
                              toYear={2030}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newItem.endDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {newItem.endDate ? formatDisplayDate(newItem.endDate) : <span>MM/YYYY</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={newItem.endDate ? new Date(newItem.endDate) : undefined}
                              onSelect={(date) => date && setNewItem({
                                ...newItem,
                                endDate: format(date, "yyyy-MM")
                              })}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                              captionLayout="dropdown-buttons"
                              fromYear={1990}
                              toYear={2030}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-item-description">Description</Label>
                      <Textarea
                        id="new-item-description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Enter a description..."
                        rows={5}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
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
                        Cancel
                      </Button>
                      <Button onClick={() => handleAddItem(section.id)}>
                        Add Item
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => setAddingItemToSectionId(section.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      
      {/* Add new section */}
      {isAddingSectionName ? (
        <div className="p-4 border border-gray-200 rounded-lg space-y-4">
          <h4 className="font-medium">Add New Section</h4>
          
          <div className="space-y-2">
            <Label htmlFor="section-name">Section Name</Label>
            <Input
              id="section-name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Projects, Certifications, Languages, etc."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingSectionName(false);
                setNewSectionName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSection}>
              Add Section
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAddingSectionName(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Custom Section
        </Button>
      )}
    </div>
  );
};

export default CustomSectionsForm;
