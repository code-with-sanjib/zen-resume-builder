
import { Resume } from "@/contexts/ResumeContext";

interface ResumeTemplateProps {
  resume: Resume;
}

const ModernTemplate = ({ resume }: ResumeTemplateProps) => {
  const { personal, experience, education, skills } = resume;

  return (
    <div className="p-8 font-inter text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b-4 border-primary mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{personal.fullName}</h1>
          <p className="text-xl text-primary font-medium mt-1">{personal.jobTitle}</p>
        </div>
        <div className="text-right text-sm">
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
          {personal.website && <p className="text-primary">{personal.website}</p>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-primary mb-2">PROFILE</h2>
          <p className="text-sm">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-primary mb-2">EXPERIENCE</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm font-medium text-primary">{exp.company}</p>
              <p className="text-sm mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills and Education in 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">SKILLS</h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center">
                  <div className="w-1/3">{skill.name}</div>
                  <div className="w-2/3 bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${skill.level * 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">EDUCATION</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <span className="text-sm">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-sm font-medium text-primary">{edu.institution}</p>
                <p className="text-sm">{edu.field}</p>
                {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
