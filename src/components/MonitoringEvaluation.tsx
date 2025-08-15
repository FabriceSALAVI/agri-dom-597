import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditableTable, Column } from '@/components/ui/editable-table';
import { useSector } from '@/contexts/SectorContext';
import { useCRM } from '@/contexts/CRMContext';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Plus,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface IndicatorData {
  id: string;
  name: string;
  category: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  dataSource: string;
  frequency: string;
  lastUpdate: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  trend: 'up' | 'down' | 'stable';
}

interface ActivityData {
  id: string;
  name: string;
  type: 'input' | 'output' | 'outcome' | 'impact';
  planned: number;
  actual: number;
  unit: string;
  progress: number;
  deadline: string;
  responsible: string;
  status: 'completed' | 'in-progress' | 'delayed' | 'not-started';
}

const MonitoringEvaluation = () => {
  const { currentSector, isConfigurable } = useSector();
  const { exportModuleData } = useCRM();

  const [activeTab, setActiveTab] = useState<'indicators' | 'activities' | 'reports'>('indicators');
  
  // Sample data - in real app this would come from the sector configuration
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([
    {
      id: '1',
      name: 'Productivité agricole',
      category: 'Production',
      baseline: 5.2,
      target: 8.0,
      current: 6.8,
      unit: 't/ha',
      dataSource: 'Données de terrain',
      frequency: 'Mensuel',
      lastUpdate: '2024-01-15',
      status: 'on-track',
      trend: 'up'
    },
    {
      id: '2',
      name: 'Revenus agricoles',
      category: 'Économique',
      baseline: 12000,
      target: 18000,
      current: 15500,
      unit: '€/an',
      dataSource: 'Comptabilité',
      frequency: 'Trimestriel',
      lastUpdate: '2024-01-10',
      status: 'on-track',
      trend: 'up'
    },
    {
      id: '3',
      name: 'Adoption de pratiques durables',
      category: 'Environnement',
      baseline: 25,
      target: 80,
      current: 45,
      unit: '%',
      dataSource: 'Enquêtes',
      frequency: 'Semestriel',
      lastUpdate: '2024-01-05',
      status: 'at-risk',
      trend: 'stable'
    }
  ]);

  const [activityData, setActivityData] = useState<ActivityData[]>([
    {
      id: '1',
      name: 'Formation des agriculteurs',
      type: 'input',
      planned: 100,
      actual: 85,
      unit: 'participants',
      progress: 85,
      deadline: '2024-03-31',
      responsible: 'Équipe formation',
      status: 'in-progress'
    },
    {
      id: '2',
      name: 'Distribution d\'intrants',
      type: 'input',
      planned: 500,
      actual: 500,
      unit: 'kits',
      progress: 100,
      deadline: '2024-02-28',
      responsible: 'Équipe logistique',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Augmentation des rendements',
      type: 'outcome',
      planned: 30,
      actual: 20,
      unit: '%',
      progress: 67,
      deadline: '2024-12-31',
      responsible: 'Équipe technique',
      status: 'delayed'
    }
  ]);

  const indicatorColumns: Column[] = [
    { id: 'name', header: 'Indicateur', accessorKey: 'name', isEditable: true },
    { id: 'category', header: 'Catégorie', accessorKey: 'category', type: 'select', 
      options: ['Production', 'Économique', 'Environnement', 'Social'], isEditable: true },
    { id: 'baseline', header: 'Référence', accessorKey: 'baseline', type: 'number', isEditable: true },
    { id: 'target', header: 'Cible', accessorKey: 'target', type: 'number', isEditable: true },
    { id: 'current', header: 'Actuel', accessorKey: 'current', type: 'number', isEditable: true },
    { id: 'unit', header: 'Unité', accessorKey: 'unit', isEditable: true },
    { id: 'progress', header: 'Progrès', accessorKey: 'progress', width: '120px' },
    { id: 'status', header: 'Statut', accessorKey: 'status', width: '120px' }
  ];

  const activityColumns: Column[] = [
    { id: 'name', header: 'Activité', accessorKey: 'name', isEditable: true },
    { id: 'type', header: 'Type', accessorKey: 'type', type: 'select',
      options: ['input', 'output', 'outcome', 'impact'], isEditable: true },
    { id: 'planned', header: 'Planifié', accessorKey: 'planned', type: 'number', isEditable: true },
    { id: 'actual', header: 'Réalisé', accessorKey: 'actual', type: 'number', isEditable: true },
    { id: 'unit', header: 'Unité', accessorKey: 'unit', isEditable: true },
    { id: 'progress', header: 'Progrès', accessorKey: 'progress', width: '120px' },
    { id: 'deadline', header: 'Échéance', accessorKey: 'deadline', type: 'text', isEditable: true },
    { id: 'responsible', header: 'Responsable', accessorKey: 'responsible', isEditable: true },
    { id: 'status', header: 'Statut', accessorKey: 'status', width: '120px' }
  ];

  // Enhanced data for table display
  const enhancedIndicatorData = indicatorData.map(indicator => ({
    ...indicator,
    progress: Math.round((indicator.current / indicator.target) * 100),
    status: getStatusBadge(indicator.status),
    name: indicator.name + (indicator.trend === 'up' ? ' ↗️' : indicator.trend === 'down' ? ' ↘️' : ' ➡️')
  }));

  const enhancedActivityData = activityData.map(activity => ({
    ...activity,
    status: getActivityStatusBadge(activity.status),
    progress: `${activity.progress}%`
  }));

  function getStatusBadge(status: string) {
    const badges = {
      'on-track': '🟢 En cours',
      'at-risk': '🟡 À risque',
      'off-track': '🔴 Hors trajectoire'
    };
    return badges[status as keyof typeof badges] || status;
  }

  function getActivityStatusBadge(status: string) {
    const badges = {
      'completed': '✅ Terminé',
      'in-progress': '🔄 En cours',
      'delayed': '⏰ Retard',
      'not-started': '⭕ Non démarré'
    };
    return badges[status as keyof typeof badges] || status;
  }

  const handleIndicatorUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...indicatorData];
    newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
    
    // Recalculate progress and status if baseline, target, or current changes
    if (['baseline', 'target', 'current'].includes(columnId)) {
      const indicator = newData[rowIndex];
      const progress = (indicator.current / indicator.target) * 100;
      
      let status: 'on-track' | 'at-risk' | 'off-track';
      if (progress >= 80) status = 'on-track';
      else if (progress >= 60) status = 'at-risk';
      else status = 'off-track';
      
      newData[rowIndex] = { ...indicator, status };
    }
    
    setIndicatorData(newData);
    toast.success('Indicateur mis à jour');
  };

  const handleActivityUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...activityData];
    newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
    
    // Recalculate progress if planned or actual changes
    if (['planned', 'actual'].includes(columnId)) {
      const activity = newData[rowIndex];
      const progress = Math.round((activity.actual / activity.planned) * 100);
      
      let status: 'completed' | 'in-progress' | 'delayed' | 'not-started';
      if (progress >= 100) status = 'completed';
      else if (progress >= 50) status = 'in-progress';
      else if (progress > 0) status = 'delayed';
      else status = 'not-started';
      
      newData[rowIndex] = { ...activity, progress, status };
    }
    
    setActivityData(newData);
    toast.success('Activité mise à jour');
  };

  const handleExport = async (type: 'indicators' | 'activities') => {
    const data = type === 'indicators' ? indicatorData : activityData;
    const success = await exportModuleData(`suivi_evaluation_${type}`, 'excel', data);
    if (success) {
      toast.success(`Export ${type} réussi`);
    } else {
      toast.error(`Erreur lors de l'export ${type}`);
    }
  };

  const getOverallProgress = () => {
    const onTrack = indicatorData.filter(i => i.status === 'on-track').length;
    return Math.round((onTrack / indicatorData.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suivi & Évaluation</h1>
          <p className="text-muted-foreground">
            Secteur: {currentSector.name} | Cadre: {currentSector.evaluationFramework.name}
          </p>
        </div>
        <div className="flex gap-2">
          {isConfigurable && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurer
            </Button>
          )}
          <Button onClick={() => handleExport(activeTab as 'indicators' | 'activities')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progrès global</p>
                <p className="text-2xl font-bold">{getOverallProgress()}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Indicateurs</p>
                <p className="text-2xl font-bold">{indicatorData.length}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activités</p>
                <p className="text-2xl font-bold">{activityData.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dernière MàJ</p>
                <p className="text-sm font-medium">Aujourd'hui</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'indicators' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('indicators')}
        >
          Indicateurs
        </Button>
        <Button
          variant={activeTab === 'activities' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('activities')}
        >
          Activités
        </Button>
        <Button
          variant={activeTab === 'reports' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('reports')}
        >
          Rapports
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'indicators' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tableau de bord des indicateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditableTable
              data={enhancedIndicatorData}
              columns={indicatorColumns}
              onUpdate={handleIndicatorUpdate}
              onAdd={(newRow) => {
            setIndicatorData([...indicatorData, { 
              id: (indicatorData.length + 1).toString(),
              name: newRow.name || 'Nouvel indicateur',
              category: newRow.category || 'Production',
              baseline: 0,
              target: 0,
              current: 0,
              unit: newRow.unit || '',
              dataSource: 'Manuel',
              frequency: 'Mensuel',
              lastUpdate: new Date().toISOString().split('T')[0],
              status: 'off-track' as any,
              trend: 'stable' as any
            }]);
                toast.success('Nouvel indicateur ajouté');
              }}
              onDelete={(rowIndex) => {
                setIndicatorData(indicatorData.filter((_, i) => i !== rowIndex));
                toast.success('Indicateur supprimé');
              }}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 'activities' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Suivi des activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditableTable
              data={enhancedActivityData}
              columns={activityColumns}
              onUpdate={handleActivityUpdate}
              onAdd={(newRow) => {
            setActivityData([...activityData, { 
              id: (activityData.length + 1).toString(),
              name: newRow.name || 'Nouvelle activité',
              type: newRow.type || 'input',
              planned: 0,
              actual: 0,
              unit: newRow.unit || '',
              progress: 0,
              deadline: new Date().toISOString().split('T')[0],
              responsible: 'Non assigné',
              status: 'not-started' as any
            }]);
                toast.success('Nouvelle activité ajoutée');
              }}
              onDelete={(rowIndex) => {
                setActivityData(activityData.filter((_, i) => i !== rowIndex));
                toast.success('Activité supprimée');
              }}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 'reports' && (
        <Card>
          <CardHeader>
            <CardTitle>Rapports de suivi et évaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Rapport mensuel</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Synthèse des progrès du mois en cours
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Générer
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Rapport trimestriel</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyse détaillée des résultats trimestriels
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Générer
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Rapport d'impact</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Évaluation de l'impact du projet
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Générer
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Tableau de bord exécutif</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Vue d'ensemble pour la direction
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Générer
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonitoringEvaluation;