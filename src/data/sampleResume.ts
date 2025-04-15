
import { Resume } from "@/contexts/ResumeContext";

export const sampleResume: Resume = {
  personal: {
    fullName: "Alex Thompson",
    jobTitle: "Senior Software Engineer",
    email: "alex.thompson@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "https://alexthompson.dev",
    summary: "Results-driven software engineer with 8+ years of experience in full-stack development. Specialized in building scalable web applications and leading engineering teams. Strong focus on code quality and mentoring junior developers.",
  },
  experience: [
    {
      id: "exp1",
      company: "TechCorp Solutions",
      position: "Senior Software Engineer",
      startDate: "2020",
      endDate: "",
      current: true,
      description: "• Led development of microservices architecture serving 1M+ users\n• Mentored team of 5 junior developers\n• Reduced API response time by 40% through optimization\n• Implemented CI/CD pipeline reducing deployment time by 60%",
    },
    {
      id: "exp2",
      company: "InnovateTech",
      position: "Software Engineer",
      startDate: "2017",
      endDate: "2020",
      current: false,
      description: "• Developed and maintained 3 core product features\n• Collaborated with UX team to improve user experience\n• Implemented automated testing increasing code coverage to 85%",
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2013",
      endDate: "2017",
      description: "Major in Computer Science, Minor in Mathematics. GPA: 3.8/4.0",
    }
  ],
  skills: [
    { id: "skill1", name: "React", level: 5 },
    { id: "skill2", name: "TypeScript", level: 5 },
    { id: "skill3", name: "Node.js", level: 4 },
    { id: "skill4", name: "Python", level: 4 },
    { id: "skill5", name: "AWS", level: 4 },
    { id: "skill6", name: "Docker", level: 3 },
    { id: "skill7", name: "GraphQL", level: 3 },
  ],
  links: [
    { id: "link1", label: "GitHub", url: "https://github.com/alexthompson" },
    { id: "link2", label: "LinkedIn", url: "https://linkedin.com/in/alexthompson" },
  ],
  projects: [
    {
      id: "proj1",
      title: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform using React, Node.js, and MongoDB",
      startDate: "2022",
      endDate: "2023"
    }
  ],
  languages: [
    { id: "lang1", name: "English", level: "Native" },
    { id: "lang2", name: "Spanish", level: "Professional" }
  ],
  extracurricular: [],
  references: [],
  internships: [],
  hobbies: [],
  courses: [],
  customSections: [],
  selectedTemplate: "professional"
};
