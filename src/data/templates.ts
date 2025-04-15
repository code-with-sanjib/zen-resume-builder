
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  color: string;
  isModern: boolean;
  isMinimal: boolean;
  isProfessional: boolean;
  isCreative: boolean;
}

export const defaultTemplates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and ATS-friendly template with a clean layout',
    thumbnail: '/templates/classic.png',
    color: '#0072b1',
    isModern: false,
    isMinimal: true,
    isProfessional: true,
    isCreative: false,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with a professional touch',
    thumbnail: '/templates/modern.png',
    color: '#2a9d8f',
    isModern: true,
    isMinimal: false,
    isProfessional: true,
    isCreative: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design focusing on content',
    thumbnail: '/templates/minimal.png',
    color: '#6c757d',
    isModern: false,
    isMinimal: true,
    isProfessional: true,
    isCreative: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Structured layout with clear section dividers',
    thumbnail: '/lovable-uploads/aacdac04-ed3b-4ba4-a4e8-9b2bfb55064f.png',
    color: '#000000',
    isModern: false,
    isMinimal: false,
    isProfessional: true,
    isCreative: false,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated template for senior positions',
    thumbnail: '/templates/executive.png',
    color: '#343a40',
    isModern: false,
    isMinimal: false,
    isProfessional: true,
    isCreative: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique layout for design and creative fields',
    thumbnail: '/templates/creative.png',
    color: '#e76f51',
    isModern: true,
    isMinimal: false,
    isProfessional: false,
    isCreative: true,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional template ideal for business positions',
    thumbnail: '/templates/corporate.png',
    color: '#1d3557',
    isModern: false,
    isMinimal: false,
    isProfessional: true,
    isCreative: false,
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Direct and clean layout focusing on experience',
    thumbnail: '/templates/simple.png',
    color: '#495057',
    isModern: false,
    isMinimal: true,
    isProfessional: true,
    isCreative: false,
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Tech-focused template highlighting skills',
    thumbnail: '/templates/tech.png',
    color: '#3a86ff',
    isModern: true,
    isMinimal: false,
    isProfessional: true,
    isCreative: false,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with elegant typography',
    thumbnail: '/templates/elegant.png',
    color: '#7209b7',
    isModern: true,
    isMinimal: false,
    isProfessional: true,
    isCreative: true,
  }
];
