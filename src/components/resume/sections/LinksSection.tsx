
import React from "react";
import { Link } from "@/contexts/ResumeContext";
import { Link as LinkIcon } from "lucide-react";

interface LinksSectionProps {
  links: Link[];
}

const LinksSection: React.FC<LinksSectionProps> = ({ links }) => {
  if (links.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Social</h2>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <a 
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full text-sm"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default LinksSection;
