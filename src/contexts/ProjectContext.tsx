import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  progress: number;
  budget: number;
  sector: string;
  location: string;
  manager: string;
  objectives: string[];
  activities: Activity[];
  beneficiaries: number;
}

interface Activity {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  progress: number;
  responsible: string;
  indicators: string[];
  budget: number;
  dependencies: string[];
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string) => void;
  addActivity: (projectId: string, activity: Omit<Activity, 'id'>) => void;
  updateActivity: (projectId: string, activityId: string, activity: Partial<Activity>) => void;
  getProjectProgress: (projectId: string) => number;
  getOverallStats: () => {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalBudget: number;
    totalBeneficiaries: number;
  };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Projet Agricole Durable',
    description: 'Amélioration des pratiques agricoles durables en Guadeloupe',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    progress: 65,
    budget: 150000,
    sector: 'agriculture',
    location: 'Guadeloupe',
    manager: 'Jean Dupont',
    objectives: [
      'Augmenter les rendements de 30%',
      'Former 100 agriculteurs',
      'Réduire l\'usage de pesticides de 50%'
    ],
    activities: [
      {
        id: '1-1',
        name: 'Formation des agriculteurs',
        description: 'Sessions de formation sur les techniques durables',
        startDate: '2024-02-01',
        endDate: '2024-06-30',
        status: 'in-progress',
        progress: 75,
        responsible: 'Marie Martin',
        indicators: ['Nombre de participants', 'Taux de satisfaction'],
        budget: 25000,
        dependencies: []
      },
      {
        id: '1-2',
        name: 'Distribution d\'équipements',
        description: 'Fourniture d\'outils et équipements agricoles',
        startDate: '2024-03-01',
        endDate: '2024-09-30',
        status: 'in-progress',
        progress: 60,
        responsible: 'Paul Leroy',
        indicators: ['Nombre d\'équipements distribués', 'Taux d\'utilisation'],
        budget: 75000,
        dependencies: ['1-1']
      }
    ],
    beneficiaries: 500
  },
  {
    id: '2',
    name: 'Programme Éducation Numérique',
    description: 'Digitalisation des écoles rurales',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    status: 'active',
    progress: 35,
    budget: 200000,
    sector: 'education',
    location: 'Martinique',
    manager: 'Sophie Bernard',
    objectives: [
      'Équiper 20 écoles',
      'Former 150 enseignants',
      'Améliorer les résultats scolaires de 25%'
    ],
    activities: [
      {
        id: '2-1',
        name: 'Installation d\'équipements',
        description: 'Mise en place des infrastructures numériques',
        startDate: '2024-04-01',
        endDate: '2024-08-31',
        status: 'in-progress',
        progress: 40,
        responsible: 'Tech Solutions',
        indicators: ['Écoles équipées', 'Connectivité internet'],
        budget: 120000,
        dependencies: []
      }
    ],
    beneficiaries: 1200
  }
];

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, projectUpdate: Partial<Project>) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, ...projectUpdate } : p
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProjectState(null);
    }
  };

  const setCurrentProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    setCurrentProjectState(project || null);
  };

  const addActivity = (projectId: string, activity: Omit<Activity, 'id'>) => {
    const newActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, activities: [...p.activities, newActivity] }
        : p
    ));
  };

  const updateActivity = (projectId: string, activityId: string, activityUpdate: Partial<Activity>) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? {
            ...p, 
            activities: p.activities.map(a => 
              a.id === activityId ? { ...a, ...activityUpdate } : a
            )
          }
        : p
    ));
  };

  const getProjectProgress = (projectId: string): number => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.activities.length) return 0;
    
    const totalProgress = project.activities.reduce((sum, activity) => sum + activity.progress, 0);
    return Math.round(totalProgress / project.activities.length);
  };

  const getOverallStats = () => {
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
      totalBeneficiaries: projects.reduce((sum, p) => sum + p.beneficiaries, 0)
    };
  };

  const value = {
    projects,
    currentProject,
    addProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    addActivity,
    updateActivity,
    getProjectProgress,
    getOverallStats
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;