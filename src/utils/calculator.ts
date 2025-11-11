import { Item, PlacedItem, PackingResult } from "../components/types";

const CONTAINER_SPECS = {
  "20ft": { width: 2.35, height: 2.39, length: 5.9, maxWeight: 28200 },
  "40ft": { width: 2.35, height: 2.39, length: 12.03, maxWeight: 28700 },
};

export class PackingCalculator {
  static packItems(
    items: Item[],
    containerType: "20ft" | "40ft"
  ): PackingResult {
    const container = CONTAINER_SPECS[containerType];
    const placedItems: PlacedItem[] = [];
    const remainingItems: Item[] = [...items];

    let currentPosition: [number, number, number] = [0, 0, 0];
    let currentLayerHeight = 0;
    let totalWeight = 0;

    const sortedItems = [...items].sort(
      (a, b) => b.width * b.height * b.length - a.width * a.height * a.length
    );

    for (const item of sortedItems) {
      const fitsWidth = currentPosition[0] + item.width <= container.width;
      const fitsHeight = currentPosition[1] + item.height <= container.height;
      const fitsLength = currentPosition[2] + item.length <= container.length;

      if (
        fitsWidth &&
        fitsHeight &&
        fitsLength &&
        totalWeight + item.weight <= container.maxWeight
      ) {
        placedItems.push({
          ...item,
          position: [...currentPosition] as [number, number, number],
          color: item.color || this.getRandomColor(),
        });

        currentPosition[0] += item.width;
        currentLayerHeight = Math.max(currentLayerHeight, item.height);

        totalWeight += item.weight;

        if (currentPosition[0] + item.width > container.width) {
          currentPosition[0] = 0;
          currentPosition[1] += currentLayerHeight;
          currentLayerHeight = 0;
        }

        if (currentPosition[1] + item.height > container.height) {
          currentPosition[0] = 0;
          currentPosition[1] = 0;
          currentPosition[2] += item.length;
        }

        const index = remainingItems.findIndex((i) => i.id === item.id);
        if (index > -1) {
          remainingItems.splice(index, 1);
        }
      }
    }

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

  private static getRandomColor(): string {
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
}
