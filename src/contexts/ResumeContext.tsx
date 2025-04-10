import React, { createContext, useState, useContext } from 'react';
import { defaultTemplates } from '@/data/templates';

export type ResumeSection = 
  | 'personal' 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'extracurricular' 
  | 'references' 
  | 'internships' 
  | 'languages' 
  | 'hobbies' 
  | 'courses' 
  | 'projects';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface ExtracurricularActivity {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Reference {
  id: string;
  fullName: string;
  company: string;
  role: string;
  email: string;
  phone: string;
}

export interface Internship {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Hobby {
  id: string;
  description: string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  startDate: string;
  endDate: string;
  certificateLink?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface Resume {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  extracurricular: ExtracurricularActivity[];
  references: Reference[];
  internships: Internship[];
  languages: Language[];
  hobbies: Hobby[];
  courses: Course[];
  projects: Project[];
  customSections: CustomSection[];
  selectedTemplate: string;
}

const defaultResume: Resume = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  extracurricular: [],
  references: [],
  internships: [],
  languages: [],
  hobbies: [],
  courses: [],
  projects: [],
  customSections: [],
  selectedTemplate: defaultTemplates[0].id,
};

interface ResumeContextType {
  resume: Resume;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  
  addExtracurricular: (activity: Omit<ExtracurricularActivity, 'id'>) => void;
  updateExtracurricular: (id: string, activity: Partial<ExtracurricularActivity>) => void;
  removeExtracurricular: (id: string) => void;
  reorderExtracurricular: (items: ExtracurricularActivity[]) => void;
  
  addReference: (reference: Omit<Reference, 'id'>) => void;
  updateReference: (id: string, reference: Partial<Reference>) => void;
  removeReference: (id: string) => void;
  reorderReferences: (items: Reference[]) => void;
  
  addInternship: (internship: Omit<Internship, 'id'>) => void;
  updateInternship: (id: string, internship: Partial<Internship>) => void;
  removeInternship: (id: string) => void;
  reorderInternships: (items: Internship[]) => void;
  
  addLanguage: (language: Omit<Language, 'id'>) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  reorderLanguages: (items: Language[]) => void;
  
  addHobby: (hobby: Omit<Hobby, 'id'>) => void;
  updateHobby: (id: string, hobby: Partial<Hobby>) => void;
  removeHobby: (id: string) => void;
  reorderHobbies: (items: Hobby[]) => void;
  
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  reorderCourses: (items: Course[]) => void;
  
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (items: Project[]) => void;
  
  addCustomSection: (title: string) => void;
  updateCustomSection: (id: string, title: string) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string, item: Omit<CustomSectionItem, 'id'>) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, item: Partial<CustomSectionItem>) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  reorderCustomSectionItems: (sectionId: string, items: CustomSectionItem[]) => void;
  
  setSelectedTemplate: (templateId: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resume, setResume] = useState<Resume>(() => {
    const saved = localStorage.getItem('resume');
    return saved ? JSON.parse(saved) : defaultResume;
  });

  React.useEffect(() => {
    localStorage.setItem('resume', JSON.stringify(resume));
  }, [resume]);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResume(prev => ({
      ...prev,
      personal: { ...prev.personal, ...info },
    }));
  };

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { ...experience, id }],
    }));
  };

  const updateExperience = (id: string, experience: Partial<Experience>) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...experience } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const addEducation = (education: Omit<Education, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { ...education, id }],
    }));
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...education } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id }],
    }));
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(s => 
        s.id === id ? { ...s, ...skill } : s
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  const addExtracurricular = (activity: Omit<ExtracurricularActivity, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      extracurricular: [...prev.extracurricular, { ...activity, id }],
    }));
  };

  const updateExtracurricular = (id: string, activity: Partial<ExtracurricularActivity>) => {
    setResume(prev => ({
      ...prev,
      extracurricular: prev.extracurricular.map(a => 
        a.id === id ? { ...a, ...activity } : a
      ),
    }));
  };

  const removeExtracurricular = (id: string) => {
    setResume(prev => ({
      ...prev,
      extracurricular: prev.extracurricular.filter(a => a.id !== id),
    }));
  };

  const reorderExtracurricular = (items: ExtracurricularActivity[]) => {
    setResume(prev => ({
      ...prev,
      extracurricular: items,
    }));
  };

  const addReference = (reference: Omit<Reference, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      references: [...prev.references, { ...reference, id }],
    }));
  };

  const updateReference = (id: string, reference: Partial<Reference>) => {
    setResume(prev => ({
      ...prev,
      references: prev.references.map(r => 
        r.id === id ? { ...r, ...reference } : r
      ),
    }));
  };

  const removeReference = (id: string) => {
    setResume(prev => ({
      ...prev,
      references: prev.references.filter(r => r.id !== id),
    }));
  };

  const reorderReferences = (items: Reference[]) => {
    setResume(prev => ({
      ...prev,
      references: items,
    }));
  };

  const addInternship = (internship: Omit<Internship, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      internships: [...prev.internships, { ...internship, id }],
    }));
  };

  const updateInternship = (id: string, internship: Partial<Internship>) => {
    setResume(prev => ({
      ...prev,
      internships: prev.internships.map(i => 
        i.id === id ? { ...i, ...internship } : i
      ),
    }));
  };

  const removeInternship = (id: string) => {
    setResume(prev => ({
      ...prev,
      internships: prev.internships.filter(i => i.id !== id),
    }));
  };

  const reorderInternships = (items: Internship[]) => {
    setResume(prev => ({
      ...prev,
      internships: items,
    }));
  };

  const addLanguage = (language: Omit<Language, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      languages: [...prev.languages, { ...language, id }],
    }));
  };

  const updateLanguage = (id: string, language: Partial<Language>) => {
    setResume(prev => ({
      ...prev,
      languages: prev.languages.map(l => 
        l.id === id ? { ...l, ...language } : l
      ),
    }));
  };

  const removeLanguage = (id: string) => {
    setResume(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id),
    }));
  };

  const reorderLanguages = (items: Language[]) => {
    setResume(prev => ({
      ...prev,
      languages: items,
    }));
  };

  const addHobby = (hobby: Omit<Hobby, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      hobbies: [...prev.hobbies, { ...hobby, id }],
    }));
  };

  const updateHobby = (id: string, hobby: Partial<Hobby>) => {
    setResume(prev => ({
      ...prev,
      hobbies: prev.hobbies.map(h => 
        h.id === id ? { ...h, ...hobby } : h
      ),
    }));
  };

  const removeHobby = (id: string) => {
    setResume(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h.id !== id),
    }));
  };

  const reorderHobbies = (items: Hobby[]) => {
    setResume(prev => ({
      ...prev,
      hobbies: items,
    }));
  };

  const addCourse = (course: Omit<Course, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      courses: [...prev.courses, { ...course, id }],
    }));
  };

  const updateCourse = (id: string, course: Partial<Course>) => {
    setResume(prev => ({
      ...prev,
      courses: prev.courses.map(c => 
        c.id === id ? { ...c, ...course } : c
      ),
    }));
  };

  const removeCourse = (id: string) => {
    setResume(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== id),
    }));
  };

  const reorderCourses = (items: Course[]) => {
    setResume(prev => ({
      ...prev,
      courses: items,
    }));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id }],
    }));
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === id ? { ...p, ...project } : p
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  };

  const reorderProjects = (items: Project[]) => {
    setResume(prev => ({
      ...prev,
      projects: items,
    }));
  };

  const addCustomSection = (title: string) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      customSections: [...prev.customSections, { id, title, items: [] }],
    }));
  };

  const updateCustomSection = (id: string, title: string) => {
    setResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(section => 
        section.id === id ? { ...section, title } : section
      ),
    }));
  };

  const removeCustomSection = (id: string) => {
    setResume(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== id),
    }));
  };

  const addCustomSectionItem = (sectionId: string, item: Omit<CustomSectionItem, 'id'>) => {
    const id = crypto.randomUUID();
    setResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(section => 
        section.id === sectionId 
          ? { ...section, items: [...section.items, { ...item, id }] } 
          : section
      ),
    }));
  };

  const updateCustomSectionItem = (sectionId: string, itemId: string, item: Partial<CustomSectionItem>) => {
    setResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              items: section.items.map(i => i.id === itemId ? { ...i, ...item } : i) 
            } 
          : section
      ),
    }));
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    setResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(section => 
        section.id === sectionId 
          ? { ...section, items: section.items.filter(i => i.id !== itemId) }
          : section
      ),
    }));
  };

  const reorderCustomSectionItems = (sectionId: string, items: CustomSectionItem[]) => {
    setResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(section => 
        section.id === sectionId 
          ? { ...section, items } 
          : section
      ),
    }));
  };

  const setSelectedTemplate = (templateId: string) => {
    setResume(prev => ({
      ...prev,
      selectedTemplate: templateId,
    }));
  };

  return (
    <ResumeContext.Provider value={{ 
      resume,
      updatePersonalInfo,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      addSkill,
      updateSkill,
      removeSkill,
      addExtracurricular,
      updateExtracurricular,
      removeExtracurricular,
      reorderExtracurricular,
      addReference,
      updateReference,
      removeReference,
      reorderReferences,
      addInternship,
      updateInternship,
      removeInternship,
      reorderInternships,
      addLanguage,
      updateLanguage,
      removeLanguage,
      reorderLanguages,
      addHobby,
      updateHobby,
      removeHobby,
      reorderHobbies,
      addCourse,
      updateCourse,
      removeCourse,
      reorderCourses,
      addProject,
      updateProject,
      removeProject,
      reorderProjects,
      addCustomSection,
      updateCustomSection,
      removeCustomSection,
      addCustomSectionItem,
      updateCustomSectionItem,
      removeCustomSectionItem,
      reorderCustomSectionItems,
      setSelectedTemplate,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
