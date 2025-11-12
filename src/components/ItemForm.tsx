"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Item } from "./types";

interface ItemFormProps {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
}

const cmToM = (cm: number) => cm / 100;

const ItemForm: React.FC<ItemFormProps> = ({ items, onItemsChange }) => {
  const [newItem, setNewItem] = useState<Omit<Item, "id">>({
    name: "",
    width: 0,
    height: 0,
    length: 0,
    weight: 0,
  });

  const [cmWidth, setCmWidth] = useState("");
  const [cmHeight, setCmHeight] = useState("");
  const [cmLength, setCmLength] = useState("");

  const addItem = () => {
    const w = parseFloat(cmWidth) || 0;
    const h = parseFloat(cmHeight) || 0;
    const d = parseFloat(cmLength) || 0;
    const weight = newItem.weight;

    if (newItem.name.trim() && w > 0 && h > 0 && d > 0 && weight > 0) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        width: cmToM(w),
        height: cmToM(h),
        length: cmToM(d),
        weight,
      };
      onItemsChange([...items, item]);

      setNewItem({ name: "", width: 0, height: 0, length: 0, weight: 0 });
      setCmWidth("");
      setCmHeight("");
      setCmLength("");
    }
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Item Name</label>
          <input
            type="text"
            placeholder="Books"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Length <span className="text-xs text-gray-500">(cm)</span>
          </label>
          <input
            type="number"
            placeholder="100"
            value={cmLength}
            onChange={(e) => setCmLength(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Width <span className="text-xs text-gray-500">(cm)</span>
          </label>
          <input
            type="number"
            placeholder="120"
            value={cmWidth}
            onChange={(e) => setCmWidth(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Height <span className="text-xs text-gray-500">(cm)</span>
          </label>
          <input
            type="number"
            placeholder="110"
            value={cmHeight}
            onChange={(e) => setCmHeight(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            placeholder="850"
            value={newItem.weight || ""}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                weight: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0.1"
            step="0.1"
          />
        </div>

        <button
          onClick={addItem}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto border-t pt-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No items yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <span className="font-medium">{item.name}</span>
                <div className="flex gap-3 text-xs text-gray-600 mt-1">
                  <span>L: {(item.length * 100).toFixed(0)} cm</span>
                  <span>W: {(item.width * 100).toFixed(0)} cm</span>
                  <span>H: {(item.height * 100).toFixed(0)} cm</span>
                  <span>Weight: {item.weight} kg</span>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800 transition"
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemForm;
