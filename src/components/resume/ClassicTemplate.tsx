
import { Resume } from "@/contexts/ResumeContext";
import { format } from "date-fns";

interface ResumeTemplateProps {
  resume: Resume;
}

const ClassicTemplate = ({ resume }: ResumeTemplateProps) => {
  const { personal, experience, education, skills, links } = resume;

  return (
    <div className="p-8 font-merriweather text-gray-800">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary">{personal.fullName}</h1>
        <p className="text-lg font-medium mt-1">{personal.jobTitle}</p>
        <div className="flex justify-center flex-wrap gap-x-4 mt-2 text-sm">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      {/* Links */}
      {links && links.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Social</h2>
          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {personal.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Profile</h2>
          <p className="text-sm">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-base">{exp.position}</h3>
                <span className="text-sm">
                  {format(new Date(exp.startDate), "MMM yyyy")} - {exp.current ? "Present" : format(new Date(exp.endDate), "MMM yyyy")}
                </span>
              </div>
              <p className="text-sm font-medium">{exp.company}</p>
              <p className="text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-base">{edu.degree} in {edu.field}</h3>
                <span className="text-sm">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <p className="text-sm font-medium">{edu.institution}</p>
              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
