
import { Resume } from "@/contexts/ResumeContext";

interface ResumeTemplateProps {
  resume: Resume;
}

const ProfessionalTemplate = ({ resume }: ResumeTemplateProps) => {
  const { personal, experience, education, skills, links } = resume;

  return (
    <div className="p-8 font-inter text-gray-800">
      {/* Header - Name and Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{personal.fullName}, {personal.jobTitle}</h1>
        <p className="text-sm mt-1">
          {personal.location && <span>{personal.location}</span>}
          {personal.phone && (
            <>
              {personal.location && <span> || Phone: </span>}
              <span>{personal.phone}</span>
            </>
          )}
          {personal.email && (
            <>
              {(personal.location || personal.phone) && <span> || Email: </span>}
              <span>{personal.email}</span>
            </>
          )}
        </p>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Links */}
      {links && links.length > 0 && (
        <>
          <div className="grid grid-cols-12 gap-2 mb-4">
            <div className="col-span-3">
              <h2 className="font-bold uppercase text-gray-700">Social Links</h2>
            </div>
            <div className="col-span-9">
              <p>
                {links.map((link, index) => (
                  <span key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {link.label}
                    </a>
                    {index < links.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-300 my-4"></div>
        </>
      )}

      {/* Summary */}
      {personal.summary && (
        <>
          <div className="grid grid-cols-12 gap-2 mb-4">
            <div className="col-span-3">
              <h2 className="font-bold uppercase text-gray-700">Summary</h2>
            </div>
            <div className="col-span-9">
              <p className="text-sm">{personal.summary}</p>
            </div>
          </div>
          <div className="border-t border-gray-300 my-4"></div>
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <div className="grid grid-cols-12 gap-2 mb-4">
            <div className="col-span-3">
              <h2 className="font-bold uppercase text-gray-700">Skills</h2>
            </div>
            <div className="col-span-9">
              {/* Group skills by category if level >= 4 (frontend/backend/etc) */}
              {(() => {
                // Check if any skill has a level of 4 or higher
                const hasHighLevelSkills = skills.some(skill => skill.level && skill.level >= 4);
                
                if (hasHighLevelSkills) {
                  // Group skills by category (using level as category indicator)
                  const frontendSkills = skills.filter(s => s.level === 5);
                  const backendSkills = skills.filter(s => s.level === 4);
                  const otherSkills = skills.filter(s => !s.level || s.level < 4);
                  
                  return (
                    <>
                      {frontendSkills.length > 0 && (
                        <div className="mb-3">
                          <h3 className="font-bold mb-1">Frontend</h3>
                          <p className="text-sm">{frontendSkills.map(s => s.name).join(', ')}</p>
                        </div>
                      )}
                      
                      {backendSkills.length > 0 && (
                        <div className="mb-3">
                          <h3 className="font-bold mb-1">Backend</h3>
                          <p className="text-sm">{backendSkills.map(s => s.name).join(', ')}</p>
                        </div>
                      )}
                      
                      {otherSkills.length > 0 && (
                        <div>
                          <h3 className="font-bold mb-1">Other Skills</h3>
                          <p className="text-sm">{otherSkills.map(s => s.name).join(', ')}</p>
                        </div>
                      )}
                    </>
                  )
                } else {
                  // Just list all skills
                  return <p className="text-sm">{skills.map(skill => skill.name).join(', ')}</p>
                }
              })()}
            </div>
          </div>
          <div className="border-t border-gray-300 my-4"></div>
        </>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="font-bold uppercase text-gray-700 mb-4">Work Experience</h2>
            
            {experience.map((exp, index) => (
              <div key={exp.id} className={`grid grid-cols-12 gap-2 ${index !== experience.length - 1 ? 'mb-6' : ''}`}>
                <div className="col-span-3">
                  <p className="text-sm">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <div className="col-span-9">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold">{exp.position}, {exp.company}</h3>
                    <span className="text-sm">{exp.locationType}</span>
                  </div>
                  <p className="text-sm mb-2">{exp.companyDescription}</p>
                  <div className="text-sm">
                    {exp.description && exp.description.includes('•') ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {exp.description.split('•').filter(Boolean).map((point, i) => (
                          <li key={i}>{point.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{exp.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 my-4"></div>
        </>
      )}

      {/* Education */}
      {education.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="font-bold uppercase text-gray-700 mb-4">Education</h2>
            
            {education.map((edu, index) => (
              <div key={edu.id} className={`grid grid-cols-12 gap-2 ${index !== education.length - 1 ? 'mb-6' : ''}`}>
                <div className="col-span-3">
                  <p className="text-sm">
                    {edu.startDate} — {edu.endDate}
                  </p>
                </div>
                <div className="col-span-9">
                  <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Additional Sections Would Appear Here */}
    </div>
  );
};

export default ProfessionalTemplate;
