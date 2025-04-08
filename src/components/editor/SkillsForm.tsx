import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SkillsForm = () => {
  const { resume, addSkill, updateSkill, removeSkill } = useResume();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 3,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id?: string
  ) => {
    const { name, value } = e.target;
    
    if (id) {
      updateSkill(id, { [name]: value });
    } else {
      setNewSkill(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLevelChange = (value: number[], id?: string) => {
    if (id) {
      updateSkill(id, { level: value[0] });
    } else {
      setNewSkill(prev => ({ ...prev, level: value[0] }));
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    addSkill(newSkill);
    setNewSkill({
      name: "",
      level: 3,
    });
    setIsAdding(false);
    toast({
      title: "Skill added",
      description: "Your skill has been added to your resume.",
    });
  };

  const handleRemove = (id: string) => {
    removeSkill(id);
    toast({
      title: "Skill removed",
      description: "The skill has been removed from your resume.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Existing skills */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {resume.skills.map((skill) => (
          <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <Label htmlFor={`skill-${skill.id}`}>{skill.name}</Label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(skill.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Input
                  id={`skill-${skill.id}`}
                  name="name"
                  value={skill.name}
                  onChange={(e) => handleInputChange(e, skill.id)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
                <Slider
                  defaultValue={[skill.level]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleLevelChange(value, skill.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new skill form */}
      {isAdding ? (
        <form onSubmit={handleAddSkill} className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium mb-4">Add New Skill</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input
                id="skill-name"
                name="name"
                value={newSkill.name}
                onChange={handleInputChange}
                placeholder="e.g. JavaScript, Project Management, etc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skill-level">Proficiency Level</Label>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
              <Slider
                id="skill-level"
                defaultValue={[newSkill.level]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => handleLevelChange(value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Skill</Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      )}
    </div>
  );
};

export default SkillsForm;
