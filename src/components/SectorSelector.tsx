import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSector } from '@/contexts/SectorContext';
import { 
  Sprout, 
  GraduationCap, 
  Heart, 
  Building,
  Factory,
  Users,
  TreePine,
  Zap,
  Settings
} from 'lucide-react';

const SECTOR_ICONS = {
  agriculture: Sprout,
  education: GraduationCap,
  health: Heart,
  infrastructure: Building,
  industry: Factory,
  social: Users,
  environment: TreePine,
  energy: Zap
};

const SectorSelector = () => {
  const { currentSector, availableSectors, switchSector, isConfigurable, toggleConfigMode } = useSector();

  const getSectorIcon = (sectorId: string) => {
    const IconComponent = SECTOR_ICONS[sectorId as keyof typeof SECTOR_ICONS] || Building;
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuration du secteur</h1>
          <p className="text-muted-foreground">
            Sélectionnez votre secteur d'activité pour personnaliser l'interface
          </p>
        </div>
        <Button
          variant={isConfigurable ? "default" : "outline"}
          onClick={toggleConfigMode}
        >
          <Settings className="h-4 w-4 mr-2" />
          {isConfigurable ? "Mode config actif" : "Activer config"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableSectors.map((sector) => (
          <Card
            key={sector.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              currentSector.id === sector.id 
                ? 'ring-2 ring-primary border-primary shadow-md' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => switchSector(sector.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    currentSector.id === sector.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {getSectorIcon(sector.id)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{sector.name}</CardTitle>
                    {currentSector.id === sector.id && (
                      <Badge variant="default" className="mt-1">
                        Actuel
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {sector.description}
              </p>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Modules disponibles:
                </div>
                <div className="flex flex-wrap gap-1">
                  {sector.modules.slice(0, 3).map((module) => (
                    <Badge key={module.id} variant="secondary" className="text-xs">
                      {module.name}
                    </Badge>
                  ))}
                  {sector.modules.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{sector.modules.length - 3} autres
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Cadre d'évaluation:
                </div>
                <div className="text-sm font-medium">
                  {sector.evaluationFramework.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {sector.evaluationFramework.phases.length} phases, {' '}
                  {sector.evaluationFramework.indicators.length} indicateurs
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Secteur actuel: {currentSector.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Modules configurés</h3>
              <div className="space-y-2">
                {currentSector.modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{module.name}</div>
                      <div className="text-sm text-muted-foreground">{module.description}</div>
                    </div>
                    <Badge variant="outline">
                      {module.fields.length} champs
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Cadre d'évaluation</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">{currentSector.evaluationFramework.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Phases du cycle:
                  </div>
                  <div className="mt-2 space-y-1">
                    {currentSector.evaluationFramework.phases.map((phase) => (
                      <div key={phase.id} className="flex items-center justify-between text-sm">
                        <span>{phase.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {phase.timeframe}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorSelector;