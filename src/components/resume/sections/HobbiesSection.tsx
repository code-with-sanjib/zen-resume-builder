
import React from "react";
import { Hobby } from "@/contexts/ResumeContext";
import ReactMarkdown from "react-markdown";

interface HobbiesSectionProps {
  hobbies: Hobby[];
}

const HobbiesSection: React.FC<HobbiesSectionProps> = ({ hobbies }) => {
  // Ensure hobbies is an array even if it's undefined
  const hobbyItems = hobbies || [];
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Hobbies & Interests</h2>
      <div className="flex flex-wrap gap-2">
        {hobbyItems.map((hobby) => (
          <div
            key={hobby.id}
            className="bg-gray-100 rounded-full px-3 py-1 text-sm"
          >
            {hobby.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HobbiesSection;
