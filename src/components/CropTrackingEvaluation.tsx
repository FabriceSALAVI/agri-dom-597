import React, { useState } from 'react';
import { EditableTable, Column } from './ui/editable-table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface CropEvaluation {
  id: string;
  culture: string;
  parcelle: string;
  typeParcelle: string; // Traitement ou Contrôle
  typeEvaluation: string; // Pré ou Post
  dateEvaluation: string;
  stadeGrowth: string;
  sante: string;
  rendementEstime: number;
  problemes: string;
  actionsRecommandees: string;
  priorite: string;
  statut: string;
  prochaineSuivi: string;
  notes: string;
}

const initialData: CropEvaluation[] = [
  {
    id: '1',
    culture: 'Canne à Sucre',
    parcelle: 'Parcelle Nord A',
    typeParcelle: 'Traitement',
    typeEvaluation: 'Pré',
    dateEvaluation: '2024-01-10',
    stadeGrowth: 'Tallage',
    sante: 'Bonne',
    rendementEstime: 75,
    problemes: 'Aucun',
    actionsRecommandees: 'Application traitement prévu',
    priorite: 'Moyenne',
    statut: 'En cours',
    prochaineSuivi: '2024-02-01',
    notes: 'État initial avant traitement'
  },
  {
    id: '2',
    culture: 'Canne à Sucre',
    parcelle: 'Parcelle Nord A',
    typeParcelle: 'Traitement',
    typeEvaluation: 'Post',
    dateEvaluation: '2024-01-25',
    stadeGrowth: 'Tallage',
    sante: 'Excellente',
    rendementEstime: 90,
    problemes: 'Aucun',
    actionsRecommandees: 'Surveillance continue',
    priorite: 'Basse',
    statut: 'Optimal',
    prochaineSuivi: '2024-02-10',
    notes: 'Amélioration nette après traitement'
  },
  {
    id: '3',
    culture: 'Canne à Sucre',
    parcelle: 'Parcelle Nord B',
    typeParcelle: 'Contrôle',
    typeEvaluation: 'Pré',
    dateEvaluation: '2024-01-10',
    stadeGrowth: 'Tallage',
    sante: 'Bonne',
    rendementEstime: 75,
    problemes: 'Aucun',
    actionsRecommandees: 'Surveillance sans intervention',
    priorite: 'Moyenne',
    statut: 'En cours',
    prochaineSuivi: '2024-02-01',
    notes: 'Parcelle témoin - état initial'
  },
  {
    id: '4',
    culture: 'Canne à Sucre',
    parcelle: 'Parcelle Nord B',
    typeParcelle: 'Contrôle',
    typeEvaluation: 'Post',
    dateEvaluation: '2024-01-25',
    stadeGrowth: 'Tallage',
    sante: 'Bonne',
    rendementEstime: 78,
    problemes: 'Léger stress hydrique',
    actionsRecommandees: 'Surveillance continue',
    priorite: 'Moyenne',
    statut: 'En cours',
    prochaineSuivi: '2024-02-10',
    notes: 'Évolution naturelle sans traitement'
  },
  {
    id: '5',
    culture: 'Banane',
    parcelle: 'Parcelle Sud A',
    typeParcelle: 'Traitement',
    typeEvaluation: 'Pré',
    dateEvaluation: '2024-01-08',
    stadeGrowth: 'Floraison',
    sante: 'Moyenne',
    rendementEstime: 70,
    problemes: 'Début attaque cochenilles',
    actionsRecommandees: 'Traitement insecticide prévu',
    priorite: 'Haute',
    statut: 'Action requise',
    prochaineSuivi: '2024-01-20',
    notes: 'Nécessite intervention rapide'
  },
  {
    id: '6',
    culture: 'Banane',
    parcelle: 'Parcelle Sud B',
    typeParcelle: 'Contrôle',
    typeEvaluation: 'Pré',
    dateEvaluation: '2024-01-08',
    stadeGrowth: 'Floraison',
    sante: 'Moyenne',
    rendementEstime: 68,
    problemes: 'Début attaque cochenilles',
    actionsRecommandees: 'Surveillance seule',
    priorite: 'Haute',
    statut: 'Observation',
    prochaineSuivi: '2024-01-20',
    notes: 'Parcelle témoin - pas de traitement'
  }
];

const columns: Column[] = [
  {
    id: 'culture',
    header: 'Culture',
    accessorKey: 'culture',
    type: 'select',
    options: ['Canne à Sucre', 'Banane', 'Ananas', 'Mangue', 'Papaye', 'Igname'],
    isEditable: true,
    width: '120px'
  },
  {
    id: 'parcelle',
    header: 'Parcelle',
    accessorKey: 'parcelle',
    type: 'text',
    isEditable: true,
    width: '120px'
  },
  {
    id: 'typeParcelle',
    header: 'Type Parcelle',
    accessorKey: 'typeParcelle',
    type: 'select',
    options: ['Traitement', 'Contrôle'],
    isEditable: true,
    width: '120px'
  },
  {
    id: 'typeEvaluation',
    header: 'Type Évaluation',
    accessorKey: 'typeEvaluation',
    type: 'select',
    options: ['Pré', 'Post'],
    isEditable: true,
    width: '130px'
  },
  {
    id: 'dateEvaluation',
    header: 'Date évaluation',
    accessorKey: 'dateEvaluation',
    type: 'text',
    isEditable: true,
    width: '130px'
  },
  {
    id: 'stadeGrowth',
    header: 'Stade de croissance',
    accessorKey: 'stadeGrowth',
    type: 'select',
    options: ['Semis', 'Germination', 'Croissance', 'Tallage', 'Montaison', 'Floraison', 'Maturation', 'Récolte'],
    isEditable: true,
    width: '140px'
  },
  {
    id: 'sante',
    header: 'État santé',
    accessorKey: 'sante',
    type: 'select',
    options: ['Excellente', 'Bonne', 'Moyenne', 'Préoccupante', 'Critique'],
    isEditable: true,
    width: '110px'
  },
  {
    id: 'rendementEstime',
    header: 'Rendement (%)',
    accessorKey: 'rendementEstime',
    type: 'number',
    isEditable: true,
    width: '120px'
  },
  {
    id: 'problemes',
    header: 'Problèmes identifiés',
    accessorKey: 'problemes',
    type: 'text',
    isEditable: true,
    width: '150px'
  },
  {
    id: 'actionsRecommandees',
    header: 'Actions recommandées',
    accessorKey: 'actionsRecommandees',
    type: 'text',
    isEditable: true,
    width: '180px'
  },
  {
    id: 'priorite',
    header: 'Priorité',
    accessorKey: 'priorite',
    type: 'select',
    options: ['Basse', 'Moyenne', 'Haute', 'Urgente'],
    isEditable: true,
    width: '100px'
  },
  {
    id: 'statut',
    header: 'Statut',
    accessorKey: 'statut',
    type: 'select',
    options: ['En cours', 'Optimal', 'Action requise', 'Observation', 'Terminé'],
    isEditable: true,
    width: '120px'
  },
  {
    id: 'prochaineSuivi',
    header: 'Prochain suivi',
    accessorKey: 'prochaineSuivi',
    type: 'text',
    isEditable: true,
    width: '130px'
  },
  {
    id: 'notes',
    header: 'Notes',
    accessorKey: 'notes',
    type: 'text',
    isEditable: true,
    width: '200px'
  }
];

export const CropTrackingEvaluation = () => {
  const [data, setData] = useState<CropEvaluation[]>(initialData);

  const handleUpdate = (rowIndex: number, columnId: string, value: any) => {
    setData(prev => 
      prev.map((item, index) => 
        index === rowIndex ? { ...item, [columnId]: value } : item
      )
    );
    toast.success('Évaluation mise à jour');
  };

  const handleDelete = (rowIndex: number) => {
    setData(prev => prev.filter((_, index) => index !== rowIndex));
    toast.success('Évaluation supprimée');
  };

  const handleAdd = (newRow: Record<string, any>) => {
    const newEvaluation: CropEvaluation = {
      id: Date.now().toString(),
      culture: newRow.culture || '',
      parcelle: newRow.parcelle || '',
      typeParcelle: newRow.typeParcelle || 'Traitement',
      typeEvaluation: newRow.typeEvaluation || 'Pré',
      dateEvaluation: new Date().toISOString().split('T')[0],
      stadeGrowth: newRow.stadeGrowth || 'Croissance',
      sante: newRow.sante || 'Bonne',
      rendementEstime: newRow.rendementEstime || 0,
      problemes: newRow.problemes || '',
      actionsRecommandees: newRow.actionsRecommandees || '',
      priorite: newRow.priorite || 'Moyenne',
      statut: newRow.statut || 'En cours',
      prochaineSuivi: newRow.prochaineSuivi || '',
      notes: newRow.notes || ''
    };
    setData(prev => [...prev, newEvaluation]);
    toast.success('Nouvelle évaluation ajoutée');
  };

  const getStatistics = () => {
    const total = data.length;
    const traitement = data.filter(item => item.typeParcelle === 'Traitement').length;
    const controle = data.filter(item => item.typeParcelle === 'Contrôle').length;
    const preEvaluations = data.filter(item => item.typeEvaluation === 'Pré').length;
    const postEvaluations = data.filter(item => item.typeEvaluation === 'Post').length;
    const optimal = data.filter(item => item.statut === 'Optimal').length;
    const actionRequired = data.filter(item => item.statut === 'Action requise').length;
    const avgRendementTraitement = data.filter(item => item.typeParcelle === 'Traitement').reduce((sum, item) => sum + item.rendementEstime, 0) / traitement || 0;
    const avgRendementControle = data.filter(item => item.typeParcelle === 'Contrôle').reduce((sum, item) => sum + item.rendementEstime, 0) / controle || 0;
    
    return { total, traitement, controle, preEvaluations, postEvaluations, optimal, actionRequired, avgRendementTraitement, avgRendementControle };
  };

  const stats = getStatistics();

  const customActions = [
    {
      icon: <Eye className="h-4 w-4" />,
      label: 'Voir détails',
      onClick: (rowIndex: number) => {
        const item = data[rowIndex];
        toast.info(`Détails de l'évaluation: ${item.culture} - ${item.parcelle}`);
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total évaluations</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Parcelles traitement</p>
                <p className="text-2xl font-bold text-blue-600">{stats.traitement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Parcelles contrôle</p>
                <p className="text-2xl font-bold text-purple-600">{stats.controle}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">État optimal</p>
                <p className="text-2xl font-bold text-green-600">{stats.optimal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Évaluations Pré</p>
                <p className="text-xl font-bold">{stats.preEvaluations}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Évaluations Post</p>
                <p className="text-xl font-bold">{stats.postEvaluations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Rendement moyen - Traitement</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgRendementTraitement.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Rendement moyen - Contrôle</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgRendementControle.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Suivi et Évaluation des Cultures - Pré/Post Traitement</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comparaison entre parcelles traitements et parcelles contrôles avec évaluations avant et après intervention
          </p>
        </CardHeader>
        <CardContent>
          <EditableTable
            data={data}
            columns={columns}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAdd={handleAdd}
            actions={customActions}
            className="min-h-[400px]"
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier évaluations Post
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Comparer Pré/Post
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Analyser Traitement vs Contrôle
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alertes critiques
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropTrackingEvaluation;