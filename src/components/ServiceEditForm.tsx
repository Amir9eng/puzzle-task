import { useState } from 'react';
import type { Service } from '../types';

export function ServiceEditForm({
  service,
  onSave,
  onCancel,
}: {
  service: Service;
  onSave: (updates: Partial<Service>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price);
  const [status, setStatus] = useState<Service['status']>(service.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      status,
    });
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
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
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
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Service['status'])}
            className="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent bg-white"
          >
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
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
