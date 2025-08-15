import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Trash2,
  GripVertical,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  List,
  MessageSquare,
  Save,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

export type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  validation?: string;
}

interface FormBuilderProps {
  onSave: (formData: { name: string; description: string; fields: FormField[] }) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texte', icon: Type },
  { value: 'number', label: 'Nombre', icon: Hash },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'boolean', label: 'Case à cocher', icon: CheckSquare },
  { value: 'select', label: 'Liste déroulante', icon: List },
  { value: 'textarea', label: 'Zone de texte', icon: MessageSquare }
];

export const FormBuilder: React.FC<FormBuilderProps> = ({ onSave }) => {
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      label: `Nouveau champ ${type}`,
      type,
      required: false,
      placeholder: '',
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Le nom du formulaire est requis');
      return;
    }
    if (fields.length === 0) {
      toast.error('Ajoutez au moins un champ au formulaire');
      return;
    }
    
    onSave({
      name: formName,
      description: formDescription,
      fields
    });
  };

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input 
            placeholder={field.placeholder || field.label}
            disabled
          />
        );
      case 'number':
        return (
          <Input 
            type="number"
            placeholder={field.placeholder || field.label}
            disabled
          />
        );
      case 'date':
        return (
          <Input 
            type="date"
            disabled
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <label className="text-sm">{field.label}</label>
          </div>
        );
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea 
            placeholder={field.placeholder || field.label}
            disabled
          />
        );
      default:
        return null;
    }
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{formName || 'Aperçu du formulaire'}</h2>
            <p className="text-muted-foreground">{formDescription}</p>
          </div>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            Retour à l'édition
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                {renderFieldPreview(field)}
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer le formulaire
          </Button>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            Continuer l'édition
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du formulaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-name">Nom du formulaire</Label>
            <Input
              id="form-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ex: Enquête agriculteurs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Description du formulaire et de son objectif"
            />
          </div>
        </CardContent>
      </Card>

      {/* Field Types */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter des champs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {FIELD_TYPES.map((fieldType) => {
              const IconComponent = fieldType.icon;
              return (
                <Button
                  key={fieldType.value}
                  variant="outline"
                  onClick={() => addField(fieldType.value as FieldType)}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-sm">{fieldType.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fields List */}
      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Champs du formulaire ({fields.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <Badge variant="outline">
                      {FIELD_TYPES.find(t => t.value === field.type)?.label}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Libellé du champ</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Libellé du champ"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Texte d'aide (optionnel)</Label>
                    <Input
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      placeholder="Texte d'aide pour l'utilisateur"
                    />
                  </div>
                </div>
                
                {field.type === 'select' && (
                  <div className="space-y-2">
                    <Label>Options (une par ligne)</Label>
                    <Textarea
                      value={field.options?.join('\n') || ''}
                      onChange={(e) => updateField(field.id, { 
                        options: e.target.value.split('\n').filter(Boolean) 
                      })}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`required-${field.id}`}
                    checked={field.required}
                    onCheckedChange={(checked) => 
                      updateField(field.id, { required: !!checked })
                    }
                  />
                  <Label htmlFor={`required-${field.id}`}>Champ obligatoire</Label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!formName.trim() || fields.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer le formulaire
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setPreviewMode(true)}
          disabled={fields.length === 0}
        >
          <Eye className="h-4 w-4 mr-2" />
          Aperçu
        </Button>
      </div>
    </div>
  );
};

export default FormBuilder;