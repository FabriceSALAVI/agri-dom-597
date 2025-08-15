// Configuration types for different sectors
export interface SectorModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: ModuleField[];
  metrics: ModuleMetric[];
  activities: ModuleActivity[];
}

export interface ModuleField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  required?: boolean;
  options?: string[];
  unit?: string;
}

export interface ModuleMetric {
  key: string;
  label: string;
  type: 'kpi' | 'target' | 'indicator';
  calculation?: string;
  target?: number;
  unit?: string;
}

export interface ModuleActivity {
  id: string;
  name: string;
  type: 'input' | 'output' | 'outcome' | 'impact';
  indicators: string[];
  baseline?: number;
  target?: number;
}

export interface SectorConfig {
  id: string;
  name: string;
  description: string;
  modules: SectorModule[];
  evaluationFramework: EvaluationFramework;
}

export interface EvaluationFramework {
  name: string;
  phases: EvaluationPhase[];
  indicators: FrameworkIndicator[];
}

export interface EvaluationPhase {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  activities: string[];
}

export interface FrameworkIndicator {
  id: string;
  name: string;
  type: 'quantitative' | 'qualitative';
  dataSource: string;
  frequency: string;
  target?: number;
  baseline?: number;
}

// Predefined sector configurations
export const SECTOR_CONFIGS: SectorConfig[] = [
  {
    id: 'agriculture',
    name: 'Agriculture',
    description: 'Suivi et évaluation des projets agricoles',
    modules: [
      {
        id: 'parcels',
        name: 'Parcelles',
        icon: 'MapPin',
        description: 'Gestion des parcelles agricoles',
        fields: [
          { key: 'name', label: 'Nom', type: 'text', required: true },
          { key: 'surface', label: 'Surface', type: 'number', unit: 'ha', required: true },
          { key: 'crop', label: 'Culture', type: 'select', options: ['Canne à Sucre', 'Banane', 'Ananas', 'Igname'] },
          { key: 'status', label: 'Statut', type: 'select', options: ['En culture', 'En récolte', 'En préparation'] }
        ],
        metrics: [
          { key: 'yield', label: 'Rendement', type: 'kpi', unit: 't/ha' },
          { key: 'revenue', label: 'Revenus', type: 'kpi', unit: '€' },
          { key: 'cost', label: 'Coûts', type: 'indicator', unit: '€' }
        ],
        activities: [
          { id: 'planting', name: 'Plantation', type: 'input', indicators: ['surface_planted'] },
          { id: 'harvest', name: 'Récolte', type: 'output', indicators: ['quantity_harvested'] }
        ]
      }
    ],
    evaluationFramework: {
      name: 'Cadre logique agricole',
      phases: [
        { id: 'baseline', name: 'Situation de référence', description: 'Collecte des données initiales', timeframe: 'Mois 1', activities: ['data_collection'] },
        { id: 'monitoring', name: 'Suivi continu', description: 'Suivi des activités et indicateurs', timeframe: 'Mensuel', activities: ['monitoring'] },
        { id: 'evaluation', name: 'Évaluation', description: 'Évaluation des résultats et impacts', timeframe: 'Annuel', activities: ['impact_assessment'] }
      ],
      indicators: [
        { id: 'productivity', name: 'Productivité agricole', type: 'quantitative', dataSource: 'Données de production', frequency: 'Mensuel' },
        { id: 'income', name: 'Revenus agricoles', type: 'quantitative', dataSource: 'Données financières', frequency: 'Mensuel' }
      ]
    }
  },
  {
    id: 'education',
    name: 'Éducation',
    description: 'Suivi et évaluation des projets éducatifs',
    modules: [
      {
        id: 'schools',
        name: 'Établissements',
        icon: 'School',
        description: 'Gestion des établissements scolaires',
        fields: [
          { key: 'name', label: 'Nom', type: 'text', required: true },
          { key: 'type', label: 'Type', type: 'select', options: ['Primaire', 'Secondaire', 'Supérieur'] },
          { key: 'students', label: 'Nombre d\'élèves', type: 'number', required: true },
          { key: 'teachers', label: 'Nombre d\'enseignants', type: 'number', required: true }
        ],
        metrics: [
          { key: 'success_rate', label: 'Taux de réussite', type: 'kpi', unit: '%' },
          { key: 'dropout_rate', label: 'Taux d\'abandon', type: 'indicator', unit: '%' },
          { key: 'teacher_ratio', label: 'Ratio élèves/enseignant', type: 'indicator' }
        ],
        activities: [
          { id: 'enrollment', name: 'Inscription', type: 'input', indicators: ['students_enrolled'] },
          { id: 'graduation', name: 'Diplôme', type: 'output', indicators: ['students_graduated'] }
        ]
      }
    ],
    evaluationFramework: {
      name: 'Cadre d\'évaluation éducatif',
      phases: [
        { id: 'baseline', name: 'Diagnostic initial', description: 'Évaluation du niveau initial', timeframe: 'Début d\'année', activities: ['assessment'] },
        { id: 'progress', name: 'Suivi des progrès', description: 'Suivi trimestriel', timeframe: 'Trimestriel', activities: ['progress_tracking'] },
        { id: 'final', name: 'Évaluation finale', description: 'Bilan annuel', timeframe: 'Fin d\'année', activities: ['final_evaluation'] }
      ],
      indicators: [
        { id: 'literacy_rate', name: 'Taux d\'alphabétisation', type: 'quantitative', dataSource: 'Tests d\'évaluation', frequency: 'Trimestriel' },
        { id: 'satisfaction', name: 'Satisfaction des élèves', type: 'qualitative', dataSource: 'Enquêtes', frequency: 'Semestriel' }
      ]
    }
  },
  {
    id: 'health',
    name: 'Santé',
    description: 'Suivi et évaluation des projets de santé',
    modules: [
      {
        id: 'facilities',
        name: 'Structures sanitaires',
        icon: 'Hospital',
        description: 'Gestion des centres de santé',
        fields: [
          { key: 'name', label: 'Nom', type: 'text', required: true },
          { key: 'type', label: 'Type', type: 'select', options: ['Hôpital', 'Centre de santé', 'Dispensaire'] },
          { key: 'capacity', label: 'Capacité d\'accueil', type: 'number', unit: 'lits' },
          { key: 'staff', label: 'Personnel médical', type: 'number' }
        ],
        metrics: [
          { key: 'patient_satisfaction', label: 'Satisfaction patients', type: 'kpi', unit: '%' },
          { key: 'mortality_rate', label: 'Taux de mortalité', type: 'indicator', unit: '%' },
          { key: 'vaccination_coverage', label: 'Couverture vaccinale', type: 'kpi', unit: '%' }
        ],
        activities: [
          { id: 'consultation', name: 'Consultation', type: 'output', indicators: ['consultations_provided'] },
          { id: 'vaccination', name: 'Vaccination', type: 'output', indicators: ['vaccines_administered'] }
        ]
      }
    ],
    evaluationFramework: {
      name: 'Cadre d\'évaluation sanitaire',
      phases: [
        { id: 'needs_assessment', name: 'Évaluation des besoins', description: 'Analyse des besoins sanitaires', timeframe: 'Phase initiale', activities: ['needs_analysis'] },
        { id: 'implementation', name: 'Mise en œuvre', description: 'Déploiement des interventions', timeframe: 'Continu', activities: ['service_delivery'] },
        { id: 'impact', name: 'Évaluation d\'impact', description: 'Mesure de l\'impact sanitaire', timeframe: 'Annuel', activities: ['impact_measurement'] }
      ],
      indicators: [
        { id: 'infant_mortality', name: 'Mortalité infantile', type: 'quantitative', dataSource: 'Registres médicaux', frequency: 'Mensuel' },
        { id: 'service_quality', name: 'Qualité des services', type: 'qualitative', dataSource: 'Audits qualité', frequency: 'Trimestriel' }
      ]
    }
  }
];