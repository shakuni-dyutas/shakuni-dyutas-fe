import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type LobbyTabValue = 'active' | 'hot' | 'new' | 'ended';

interface LobbyTabsProps {
  value: LobbyTabValue;
  onValueChange: (value: LobbyTabValue) => void;
  className?: string;
  children?: React.ReactNode;
}

function LobbyTabs({ value, onValueChange, className, children }: LobbyTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as LobbyTabValue)}
      className={className}
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="active" className="text-xs">
          Active
        </TabsTrigger>
        <TabsTrigger value="hot" className="text-xs">
          Hot
        </TabsTrigger>
        <TabsTrigger value="new" className="text-xs">
          New
        </TabsTrigger>
        <TabsTrigger value="ended" className="text-xs">
          Ended
        </TabsTrigger>
      </TabsList>

      {children}
    </Tabs>
  );
}

export type { LobbyTabValue };
export { LobbyTabs };
