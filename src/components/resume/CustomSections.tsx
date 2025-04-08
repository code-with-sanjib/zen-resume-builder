
import { CustomSection } from "@/contexts/ResumeContext";

interface CustomSectionsProps {
  customSections: CustomSection[];
  className?: string;
}

const CustomSections: React.FC<CustomSectionsProps> = ({ customSections, className = "" }) => {
  // Early return if no custom sections or if customSections is undefined
  if (!customSections || !customSections.length) return null;

  return (
    <div className={className}>
      {customSections.map((section) => (
        <div key={section.id} className="mb-4">
          <h3 className="text-lg font-bold mb-2">{section.title}</h3>
          
          {section.items && section.items.length > 0 ? (
            section.items.map((item) => (
              <div key={item.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{item.title}</h4>
                  {item.location && <span className="text-sm">{item.location}</span>}
                </div>
                
                {(item.startDate || item.endDate) && (
                  <div className="text-sm text-gray-600 mb-1">
                    {item.startDate && item.startDate.replace('-', '/')}
                    {item.startDate && item.endDate && " - "}
                    {item.endDate && item.endDate.replace('-', '/')}
                  </div>
                )}
                
                {item.description && <p className="text-sm whitespace-pre-wrap">{item.description}</p>}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No items in this section</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomSections;
