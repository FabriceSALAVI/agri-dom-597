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
    parcelle: 'Parcelle Nord',
    dateEvaluation: '2024-01-15',
    stadeGrowth: 'Tallage',
    sante: 'Bonne',
    rendementEstime: 85,
    problemes: 'Léger stress hydrique',
    actionsRecommandees: 'Irrigation supplémentaire',
    priorite: 'Moyenne',
    statut: 'En cours',
    prochaineSuivi: '2024-02-01',
    notes: 'Croissance normale pour la saison'
  },
  {
    id: '2',
    culture: 'Banane',
    parcelle: 'Parcelle Sud',
    dateEvaluation: '2024-01-10',
    stadeGrowth: 'Floraison',
    sante: 'Excellente',
    rendementEstime: 92,
    problemes: 'Aucun',
    actionsRecommandees: 'Surveillance continue',
    priorite: 'Basse',
    statut: 'Optimal',
    prochaineSuivi: '2024-01-25',
    notes: 'Développement exceptionnel'
  },
  {
    id: '3',
    culture: 'Ananas',
    parcelle: 'Parcelle Est',
    dateEvaluation: '2024-01-08',
    stadeGrowth: 'Maturation',
    sante: 'Préoccupante',
    rendementEstime: 65,
    problemes: 'Attaque de cochenilles',
    actionsRecommandees: 'Traitement insecticide urgent',
    priorite: 'Haute',
    statut: 'Action requise',
    prochaineSuivi: '2024-01-20',
    notes: 'Nécessite intervention immédiate'
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
    options: ['En cours', 'Optimal', 'Action requise', 'Terminé'],
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
    const optimal = data.filter(item => item.statut === 'Optimal').length;
    const actionRequired = data.filter(item => item.statut === 'Action requise').length;
    const avgRendement = data.reduce((sum, item) => sum + item.rendementEstime, 0) / total;
    
    return { total, optimal, actionRequired, avgRendement };
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">État optimal</p>
                <p className="text-2xl font-bold text-green-600">{stats.optimal}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Action requise</p>
                <p className="text-2xl font-bold text-orange-600">{stats.actionRequired}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rendement moyen</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgRendement.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Suivi et Évaluation des Cultures</span>
          </CardTitle>
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
              Planifier évaluations
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyser tendances
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