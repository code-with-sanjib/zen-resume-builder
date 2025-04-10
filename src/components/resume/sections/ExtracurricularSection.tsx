
import React from "react";
import { ExtracurricularActivity } from "@/contexts/ResumeContext";
import { format } from "date-fns";

interface ExtracurricularSectionProps {
  extracurricular: ExtracurricularActivity[];
}

const ExtracurricularSection: React.FC<ExtracurricularSectionProps> = ({ extracurricular }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Extracurricular Activities</h2>
      {extracurricular.map((activity) => (
        <div key={activity.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold text-base">{activity.title}</h3>
            <span className="text-sm">
              {activity.startDate && format(new Date(activity.startDate), "MMM yyyy")}
              {activity.startDate && activity.endDate && " - "}
              {activity.endDate && format(new Date(activity.endDate), "MMM yyyy")}
            </span>
          </div>
          {activity.description && <p className="text-sm mt-1">{activity.description}</p>}
        </div>
      ))}
    </div>
  );
};

export default ExtracurricularSection;
