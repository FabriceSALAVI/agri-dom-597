import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EditableTable, Column } from '@/components/ui/editable-table';
import { useProject } from '@/contexts/ProjectContext';
import { useCRM } from '@/contexts/CRMContext';
import { 
  FolderOpen,
  Plus,
  Calendar,
  Users,
  DollarSign,
  Activity,
  Target,
  MapPin,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Pause,
  Settings,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const ProjectManagement = () => {
  const { 
    projects, 
    getOverallStats, 
    updateProject, 
    deleteProject,
    setCurrentProject 
  } = useProject();
  const { exportModuleData } = useCRM();
  
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'planning'>('all');

  const stats = getOverallStats();

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'suspended': return <Pause className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const projectColumns: Column[] = [
    { id: 'name', header: 'Nom du projet', accessorKey: 'name', isEditable: true },
    { id: 'sector', header: 'Secteur', accessorKey: 'sector', isEditable: true },
    { id: 'status', header: 'Statut', accessorKey: 'status', type: 'select',
      options: ['planning', 'active', 'completed', 'suspended'], isEditable: true },
    { id: 'progress', header: 'Progrès (%)', accessorKey: 'progress', type: 'number', isEditable: true },
    { id: 'budget', header: 'Budget (€)', accessorKey: 'budget', type: 'number', isEditable: true },
    { id: 'manager', header: 'Responsable', accessorKey: 'manager', isEditable: true },
    { id: 'location', header: 'Localisation', accessorKey: 'location', isEditable: true },
    { id: 'beneficiaries', header: 'Bénéficiaires', accessorKey: 'beneficiaries', type: 'number', isEditable: true }
  ];

  const handleProjectUpdate = (rowIndex: number, columnId: string, value: any) => {
    const project = filteredProjects[rowIndex];
    updateProject(project.id, { [columnId]: value });
    toast.success('Projet mis à jour');
  };

  const handleProjectDelete = (rowIndex: number) => {
    const project = filteredProjects[rowIndex];
    deleteProject(project.id);
    toast.success('Projet supprimé');
  };

  const handleExport = async () => {
    const success = await exportModuleData('projets', 'excel', filteredProjects);
    if (success) {
      toast.success('Export réussi');
    } else {
      toast.error('Erreur lors de l\'export');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Projets</h1>
          <p className="text-muted-foreground">
            Suivi et gestion des projets de développement
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projets</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projets Actifs</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terminés</p>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget Total</p>
                <p className="text-2xl font-bold">{stats.totalBudget.toLocaleString()}€</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bénéficiaires</p>
                <p className="text-2xl font-bold">{stats.totalBeneficiaries.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Actifs
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Terminés
          </Button>
          <Button
            variant={filter === 'planning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('planning')}
          >
            Planification
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >
            Grille
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
          >
            Tableau
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">{project.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progrès</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{project.budget.toLocaleString()}€</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{project.beneficiaries}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium">Responsable: {project.manager}</p>
                  <p className="text-muted-foreground">Secteur: {project.sector}</p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setCurrentProject(project.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des projets</CardTitle>
          </CardHeader>
          <CardContent>
            <EditableTable
              data={filteredProjects}
              columns={projectColumns}
              onUpdate={handleProjectUpdate}
              onDelete={handleProjectDelete}
              actions={[
                {
                  icon: <Eye className="h-4 w-4" />,
                  label: 'Voir détails',
                  onClick: (rowIndex) => {
                    const project = filteredProjects[rowIndex];
                    setCurrentProject(project.id);
                  }
                },
                {
                  icon: <Settings className="h-4 w-4" />,
                  label: 'Configurer',
                  onClick: (rowIndex) => {
                    toast.info('Configuration du projet');
                  }
                }
              ]}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectManagement;