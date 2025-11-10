export interface Item {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  color?: string;
}

export interface Container {
  type: "20ft" | "40ft";
  width: number;
  height: number;
  depth: number;
  maxWeight: number;
}

export interface PlacedItem extends Item {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export interface PackingResult {
  success: boolean;
  placedItems: PlacedItem[];
  remainingItems: Item[];
  totalWeight: number;
  volumeUtilization: number;
  message: string;
}
