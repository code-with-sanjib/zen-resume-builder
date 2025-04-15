import { Resume } from "@/contexts/ResumeContext";

interface ResumeTemplateProps {
  resume: Resume;
}

const MinimalTemplate = ({ resume }: ResumeTemplateProps) => {
  const { personal, experience, education, skills, links } = resume;

  return (
    <div className="p-8 font-inter text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-wide uppercase">{personal.fullName}</h1>
        <p className="text-lg text-gray-500 mt-1">{personal.jobTitle}</p>
        <div className="flex justify-center flex-wrap gap-x-6 mt-3 text-sm text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      {/* Links */}
      {links && links.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 text-center">Links</h2>
          <div className="flex flex-wrap justify-center gap-2">
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
        <div className="mb-8">
          <p className="text-sm text-center max-w-2xl mx-auto">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 text-center">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <h3 className="font-medium">{exp.position}</h3>
                <div className="text-sm text-gray-500">
                  <span className="mr-2">{exp.company}</span>
                  <span>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
              </div>
              <p className="text-sm mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 text-center">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                <div className="text-sm text-gray-500">
                  <span className="mr-2">{edu.institution}</span>
                  <span>
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              </div>
              {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 text-center">Skills</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 text-sm border border-gray-200 rounded"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
