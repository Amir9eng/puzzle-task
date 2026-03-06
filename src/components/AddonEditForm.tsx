import { useState } from 'react';
import type { Addon } from '../types';

export function AddonEditForm({
  addon,
  onSave,
  onCancel,
}: {
  addon: Addon;
  onSave: (updates: Partial<Addon>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(addon.name);
  const [price, setPrice] = useState(addon.price);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: name.trim(), price: price.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Price (£)
        </label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-[#ec4899] text-white text-sm font-medium hover:bg-[#db2777]"
        >
          Save
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
