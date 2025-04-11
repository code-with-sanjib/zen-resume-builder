
import React from "react";
import { Project } from "@/contexts/ResumeContext";
import { format } from "date-fns";

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  // Ensure projects is an array even if it's undefined
  const projectItems = projects || [];
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Projects</h2>
      {projectItems.map((project) => (
        <div key={project.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold text-base">{project.title}</h3>
            <span className="text-sm">
              {project.startDate && format(new Date(project.startDate), "MMM yyyy")}
              {project.startDate && project.endDate && " - "}
              {project.endDate && format(new Date(project.endDate), "MMM yyyy")}
            </span>
          </div>
          {project.description && (
            <div className="text-sm mt-1 rich-text-content">
              <div dangerouslySetInnerHTML={{ __html: project.description }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsSection;
