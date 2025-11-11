import { Item, PlacedItem, PackingResult } from "../components/types";

const CONTAINER_SPECS = {
  "20ft": { width: 2.35, height: 2.39, length: 5.89, maxWeight: 28200 },
  "40ft": { width: 2.35, height: 2.39, length: 12.05, maxWeight: 28700 },
};

function getRandomColor(): string {
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function itemsOverlap(a: PlacedItem, b: PlacedItem): boolean {
  return !(
    a.position[0] + a.width <= b.position[0] ||
    b.position[0] + b.width <= a.position[0] ||
    a.position[1] + a.height <= b.position[1] ||
    b.position[1] + b.height <= a.position[1] ||
    a.position[2] + a.length <= b.position[2] ||
    b.position[2] + b.length <= a.position[2]
  );
}

function tryPlaceItem(
  item: Item,
  position: [number, number, number],
  placedItems: PlacedItem[],
  container: any
): PlacedItem | null {
  const placedItem: PlacedItem = {
    ...item,
    position,
    color: item.color || getRandomColor(),
  };

  if (position[0] + item.width > container.width) return null;
  if (position[1] + item.height > container.height) return null;
  if (position[2] + item.length > container.length) return null;

  for (const placed of placedItems) {
    if (itemsOverlap(placedItem, placed)) {
      return null;
    }
  }

  return placedItem;
}

function findBestPosition(
  item: Item,
  placedItems: PlacedItem[],
  container: any
): PlacedItem | null {
  const positions: [number, number, number][] = [];

  if (placedItems.length === 0) {
    return tryPlaceItem(item, [0, 0, 0], placedItems, container);
  }

  for (const placed of placedItems) {
    positions.push([
      placed.position[0] + placed.width,
      placed.position[1],
      placed.position[2],
    ]);
    positions.push([
      placed.position[0],
      placed.position[1] + placed.height,
      placed.position[2],
    ]);
    positions.push([
      placed.position[0],
      placed.position[1],
      placed.position[2] + placed.length,
    ]);
  }

  positions.sort((a, b) => {
    const volumeA = a[0] + a[1] + a[2];
    const volumeB = b[0] + b[1] + b[2];
    return volumeA - volumeB;
  });

  for (const position of positions) {
    const placed = tryPlaceItem(item, position, placedItems, container);
    if (placed) return placed;
  }

  return null;
}

export class PackingCalculator {
  static packItems(
    items: Item[],
    containerType: "20ft" | "40ft"
  ): PackingResult {
    const container = CONTAINER_SPECS[containerType];
    const placedItems: PlacedItem[] = [];
    let totalWeight = 0;

    const sortedItems = [...items].sort(
      (a, b) => b.width * b.height * b.length - a.width * a.height * a.length
    );

    for (const item of sortedItems) {
      if (totalWeight + item.weight > container.maxWeight) continue;

      const placedItem = findBestPosition(item, placedItems, container);
      if (placedItem) {
        placedItems.push(placedItem);
        totalWeight += item.weight;
      }
    }

    const remainingItems = items.filter(
      (item) => !placedItems.find((pi) => pi.id === item.id)
    );
    const totalVolume = container.width * container.height * container.length;
    const usedVolume = placedItems.reduce(
      (sum, item) => sum + item.width * item.height * item.length,
      0
    );
    const volumeUtilization = (usedVolume / totalVolume) * 100;

    return {
      success: remainingItems.length === 0,
      placedItems,
      remainingItems,
      totalWeight,
      volumeUtilization,
      message:
        remainingItems.length === 0
          ? "All items fit successfully!"
          : `${remainingItems.length} items could not be placed.`,
    };
  }
}
