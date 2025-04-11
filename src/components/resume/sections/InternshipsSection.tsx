
import React from "react";
import { Internship } from "@/contexts/ResumeContext";
import { format } from "date-fns";

interface InternshipsSectionProps {
  internships: Internship[];
}

const InternshipsSection: React.FC<InternshipsSectionProps> = ({ internships }) => {
  // Ensure internships is an array even if it's undefined
  const internshipItems = internships || [];
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Internships</h2>
      {internshipItems.map((internship) => (
        <div key={internship.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold text-base">{internship.jobTitle}</h3>
            <span className="text-sm">
              {internship.startDate && format(new Date(internship.startDate), "MMM yyyy")}
              {" - "}
              {internship.current ? "Present" : internship.endDate && format(new Date(internship.endDate), "MMM yyyy")}
            </span>
          </div>
          <p className="text-sm font-medium">{internship.company}</p>
          {internship.description && (
            <div className="text-sm mt-1 rich-text-content">
              <div dangerouslySetInnerHTML={{ __html: internship.description }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InternshipsSection;
