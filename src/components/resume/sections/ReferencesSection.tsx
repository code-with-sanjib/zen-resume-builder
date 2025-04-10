
import React from "react";
import { Reference } from "@/contexts/ResumeContext";

interface ReferencesSectionProps {
  references: Reference[];
}

const ReferencesSection: React.FC<ReferencesSectionProps> = ({ references }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">References</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {references.map((reference) => (
          <div key={reference.id} className="mb-2">
            <h3 className="font-bold text-base">{reference.fullName}</h3>
            <p className="text-sm font-medium">{reference.role}, {reference.company}</p>
            {reference.email && <p className="text-sm">{reference.email}</p>}
            {reference.phone && <p className="text-sm">{reference.phone}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferencesSection;
