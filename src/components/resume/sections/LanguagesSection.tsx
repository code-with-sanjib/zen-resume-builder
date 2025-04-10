
import React from "react";
import { Language } from "@/contexts/ResumeContext";

interface LanguagesSectionProps {
  languages: Language[];
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Languages</h2>
      <div className="flex flex-wrap gap-4">
        {languages.map((language) => (
          <div key={language.id} className="mb-1">
            <span className="font-medium">{language.name}</span>
            {language.level && (
              <span className="text-sm text-gray-500 ml-1">({language.level})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagesSection;
