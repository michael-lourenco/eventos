"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { PROBLEM_CATEGORIES } from "@/constants/map-constants";

export function FilterDrawer({
  open,
  onOpenChange,
  availableTypes,
  selectedTypes,
  onFilterChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableTypes: string[];
  selectedTypes: string[];
  onFilterChange: (selectedTypes: string[]) => void;
}) {
  // De-para para exibir o label correto
  const typeLabel = (type: string) => {
    for (const category of PROBLEM_CATEGORIES) {
      if (category.subcategories) {
        for (const sub of category.subcategories) {
          if (sub.id === type) return sub.label;
        }
      }
    }
    return type;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-80 max-w-full right-0 fixed top-0 h-full bg-background z-[9999] shadow-lg">
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>Filtrar por tipo</DrawerTitle>
          <DrawerClose asChild>
            <button
              aria-label="Fechar"
              className="rounded-full p-1 hover:bg-muted transition"
              title="Fechar filtro"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <Button
            size="sm"
            variant={selectedTypes.length === 0 ? "default" : "outline"}
            onClick={() => onFilterChange([])}
          >
            Todos
          </Button>
          {availableTypes.map((type) => (
            <Button
              key={type}
              size="sm"
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              onClick={() => {
                if (selectedTypes.includes(type)) {
                  onFilterChange(selectedTypes.filter((t) => t !== type));
                } else {
                  onFilterChange([...selectedTypes, type]);
                }
              }}
            >
              {typeLabel(type)}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
