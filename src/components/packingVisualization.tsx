"use client";

import React, { useState } from "react";
import { Package, Scale, Square } from "lucide-react";
import { Item, Container, PackingResult } from "./types";
import { PackingCalculator } from "../utils/calculator";
import Container3D from "./3dContainer";
import ItemForm from "./ItemForm";

const CONTAINERS: Container[] = [
  { type: "20ft", width: 2.44, height: 2.59, length: 6.06, maxWeight: 28200 },
  { type: "40ft", width: 2.44, height: 2.59, length: 12.19, maxWeight: 28700 },
];

const PackingVisualization: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<Container>(
    CONTAINERS[0]
  );
  const [packingResult, setPackingResult] = useState<PackingResult | null>(
    null
  );

  const calculatePacking = () => {
    const result = PackingCalculator.packItems(items, selectedContainer.type);
    setPackingResult(result);
  };

  return (
    <div className="w-full p-2 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        POC for Container Placement
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Container
            </label>
            <div className="flex space-x-4">
              {CONTAINERS.map((container) => (
                <button
                  key={container.type}
                  onClick={() => setSelectedContainer(container)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedContainer.type === container.type
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {container.type}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Container Specifications:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Width: {selectedContainer.width}m</div>
              <div>Height: {selectedContainer.height}m</div>
              <div>Length: {selectedContainer.length}m</div>
              <div>Max Weight: {selectedContainer.maxWeight}kg</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Add Items</h3>
            <ItemForm items={items} onItemsChange={setItems} />
          </div>

          <button
            onClick={calculatePacking}
            disabled={items.length === 0}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Calculate Packing
          </button>
        </div>

        <div className="space-y-4">
          {packingResult && (
            <>
              <div
                className={`p-4 rounded-lg ${
                  packingResult.success
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package size={20} />
                  <span className="font-medium">{packingResult.message}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Square size={18} className="text-blue-600" />
                    <span className="text-sm font-medium">
                      Volume Utilization
                    </span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {packingResult.volumeUtilization.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Scale size={18} className="text-purple-600" />
                    <span className="text-sm font-medium">Total Weight</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {packingResult.totalWeight}kg
                  </div>
                </div>
              </div>

              {packingResult && (
                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4">3D Visualization</h3>
                  <Container3D
                    container={selectedContainer}
                    placedItems={packingResult.placedItems}
                  />
                </div>
              )}

              {packingResult.remainingItems.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">
                    Remaining Items:
                  </h4>
                  <div className="space-y-1">
                    {packingResult.remainingItems.map((item) => (
                      <div key={item.id} className="text-sm text-red-700">
                        {item.name} ({item.width}m × {item.height}m ×{" "}
                        {item.length}m)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackingVisualization;
