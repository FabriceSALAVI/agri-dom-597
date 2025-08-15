import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditableTable, Column } from '@/components/ui/editable-table';
import { 
  FormBuilder,
  FormField as FormBuilderField,
  FieldType 
} from '@/components/FormBuilder';
import { 
  Plus,
  FileText,
  Smartphone,
  Upload,
  Download,
  Check,
  X,
  AlertCircle,
  Wifi,
  WifiOff,
  Save,
  Eye,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  validation?: string;
}

interface DataForm {
  id: string;
  name: string;
  description: string;
  sector: string;
  fields: FormField[];
  isActive: boolean;
  createdAt: string;
  responses: number;
}

interface DataEntry {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  submittedBy: string;
  location?: { lat: number; lng: number };
  status: 'draft' | 'submitted' | 'validated' | 'rejected';
  validationNotes?: string;
}

const DataCollection = () => {
  const [activeTab, setActiveTab] = useState('forms');
  const [isOnline, setIsOnline] = useState(true);
  const [selectedForm, setSelectedForm] = useState<DataForm | null>(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);

  // Sample data
  const [forms, setForms] = useState<DataForm[]>([
    {
      id: '1',
      name: 'Enquête Agriculteurs',
      description: 'Collecte de données auprès des exploitants agricoles',
      sector: 'agriculture',
      fields: [
        { id: '1', label: 'Nom de l\'exploitant', type: 'text', required: true },
        { id: '2', label: 'Surface exploitée (ha)', type: 'number', required: true },
        { id: '3', label: 'Type de culture', type: 'select', required: true, 
          options: ['Canne à sucre', 'Banane', 'Ananas', 'Légumes'] },
        { id: '4', label: 'Utilise des pratiques bio', type: 'boolean', required: false },
        { id: '5', label: 'Commentaires', type: 'textarea', required: false }
      ],
      isActive: true,
      createdAt: '2024-01-15',
      responses: 45
    },
    {
      id: '2',
      name: 'Évaluation École',
      description: 'Évaluation des conditions dans les écoles',
      sector: 'education',
      fields: [
        { id: '1', label: 'Nom de l\'école', type: 'text', required: true },
        { id: '2', label: 'Nombre d\'élèves', type: 'number', required: true },
        { id: '3', label: 'État des infrastructures', type: 'select', required: true,
          options: ['Excellent', 'Bon', 'Moyen', 'Mauvais'] },
        { id: '4', label: 'Accès internet', type: 'boolean', required: true }
      ],
      isActive: true,
      createdAt: '2024-01-20',
      responses: 12
    }
  ]);

  const [dataEntries, setDataEntries] = useState<DataEntry[]>([
    {
      id: '1',
      formId: '1',
      data: {
        'Nom de l\'exploitant': 'Jean Martin',
        'Surface exploitée (ha)': 15,
        'Type de culture': 'Canne à sucre',
        'Utilise des pratiques bio': true,
        'Commentaires': 'Transition vers l\'agriculture biologique en cours'
      },
      submittedAt: '2024-01-16T10:30:00',
      submittedBy: 'Enquêteur A',
      status: 'validated'
    },
    {
      id: '2',
      formId: '1',
      data: {
        'Nom de l\'exploitant': 'Marie Dubois',
        'Surface exploitée (ha)': 8,
        'Type de culture': 'Banane',
        'Utilise des pratiques bio': false
      },
      submittedAt: '2024-01-17T14:15:00',
      submittedBy: 'Enquêteur B',
      status: 'submitted'
    }
  ]);

  const formColumns: Column[] = [
    { id: 'name', header: 'Nom du formulaire', accessorKey: 'name', isEditable: true },
    { id: 'sector', header: 'Secteur', accessorKey: 'sector', isEditable: true },
    { id: 'responses', header: 'Réponses', accessorKey: 'responses', type: 'number' },
    { id: 'isActive', header: 'Statut', accessorKey: 'isActive', type: 'boolean', isEditable: true },
    { id: 'createdAt', header: 'Créé le', accessorKey: 'createdAt', type: 'text' }
  ];

  const entryColumns: Column[] = [
    { id: 'submittedBy', header: 'Soumis par', accessorKey: 'submittedBy' },
    { id: 'submittedAt', header: 'Date', accessorKey: 'submittedAt', type: 'text' },
    { id: 'status', header: 'Statut', accessorKey: 'status', type: 'select',
      options: ['draft', 'submitted', 'validated', 'rejected'], isEditable: true }
  ];

  const handleFormUpdate = (rowIndex: number, columnId: string, value: any) => {
    const updatedForms = [...forms];
    updatedForms[rowIndex] = { ...updatedForms[rowIndex], [columnId]: value };
    setForms(updatedForms);
    toast.success('Formulaire mis à jour');
  };

  const handleEntryUpdate = (rowIndex: number, columnId: string, value: any) => {
    const updatedEntries = [...dataEntries];
    updatedEntries[rowIndex] = { ...updatedEntries[rowIndex], [columnId]: value };
    setDataEntries(updatedEntries);
    toast.success('Entrée mise à jour');
  };

  const handleFormSave = (formData: { name: string; description: string; fields: FormBuilderField[] }) => {
    const newForm: DataForm = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      sector: 'general',
      fields: formData.fields.map(field => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required || false,
        options: field.options
      })),
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      responses: 0
    };
    
    setForms([...forms, newForm]);
    setShowFormBuilder(false);
    toast.success('Formulaire créé avec succès');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      validated: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <Check className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'submitted': return <Upload className="h-4 w-4" />;
      default: return <Edit className="h-4 w-4" />;
    }
  };

  const handleSyncOfflineData = () => {
    toast.success('Synchronisation des données hors ligne terminée');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Collecte de Données</h1>
          <p className="text-muted-foreground">
            Gestion des formulaires et collecte terrain
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge className={isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {isOnline ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </Badge>
          {!isOnline && (
            <Button variant="outline" size="sm" onClick={handleSyncOfflineData}>
              <Upload className="h-4 w-4 mr-2" />
              Synchroniser
            </Button>
          )}
          <Dialog open={showFormBuilder} onOpenChange={setShowFormBuilder}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Formulaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créateur de Formulaire</DialogTitle>
              </DialogHeader>
              <FormBuilder onSave={handleFormSave} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Formulaires</p>
                <p className="text-2xl font-bold">{forms.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Réponses totales</p>
                <p className="text-2xl font-bold">{forms.reduce((sum, f) => sum + f.responses, 0)}</p>
              </div>
              <Upload className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{dataEntries.filter(e => e.status === 'submitted').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Validées</p>
                <p className="text-2xl font-bold">{dataEntries.filter(e => e.status === 'validated').length}</p>
              </div>
              <Check className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="forms">Formulaires</TabsTrigger>
          <TabsTrigger value="data">Données collectées</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="mobile">Interface Mobile</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des formulaires</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableTable
                data={forms}
                columns={formColumns}
                onUpdate={handleFormUpdate}
                actions={[
                  {
                    icon: <Eye className="h-4 w-4" />,
                    label: 'Prévisualiser',
                    onClick: (rowIndex) => {
                      setSelectedForm(forms[rowIndex]);
                      toast.info('Prévisualisation du formulaire');
                    }
                  },
                  {
                    icon: <Smartphone className="h-4 w-4" />,
                    label: 'Version mobile',
                    onClick: (rowIndex) => {
                      toast.info('Ouverture interface mobile');
                    }
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Données collectées</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableTable
                data={dataEntries}
                columns={entryColumns}
                onUpdate={handleEntryUpdate}
                actions={[
                  {
                    icon: <Eye className="h-4 w-4" />,
                    label: 'Voir détails',
                    onClick: (rowIndex) => {
                      toast.info('Détails de l\'entrée');
                    }
                  },
                  {
                    icon: <Download className="h-4 w-4" />,
                    label: 'Exporter',
                    onClick: (rowIndex) => {
                      toast.success('Export de l\'entrée');
                    }
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <div className="grid gap-4">
            {dataEntries.filter(entry => entry.status === 'submitted').map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        Soumission #{entry.id} - {entry.submittedBy}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.submittedAt).toLocaleString()}
                      </p>
                      <div className="mt-2 space-y-1">
                        {Object.entries(entry.data).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          const updatedEntries = dataEntries.map(e => 
                            e.id === entry.id ? { ...e, status: 'validated' as any } : e
                          );
                          setDataEntries(updatedEntries);
                          toast.success('Entrée validée');
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          const updatedEntries = dataEntries.map(e => 
                            e.id === entry.id ? { ...e, status: 'rejected' as any } : e
                          );
                          setDataEntries(updatedEntries);
                          toast.error('Entrée rejetée');
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interface Mobile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Smartphone className="h-16 w-16 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold">Application Mobile Follow</h3>
                  <p className="text-muted-foreground">
                    Interface optimisée pour la collecte de données sur le terrain
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm"><strong>Fonctionnalités:</strong></p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Collecte hors ligne</li>
                      <li>• Géolocalisation automatique</li>
                      <li>• Synchronisation automatique</li>
                      <li>• Interface adaptative</li>
                    </ul>
                  </div>
                  <Button className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger l'application
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataCollection;