
import React, { createContext, useState, useContext } from 'react';
import { defaultTemplates } from '@/data/templates';

export type ResumeSection = 'personal' | 'experience' | 'education' | 'skills';

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

export interface Resume {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
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
