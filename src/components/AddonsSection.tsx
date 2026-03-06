import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Delete01Icon, Edit01Icon } from '@hugeicons/core-free-icons';
import { iconProps } from '../utils';
import { AddonEditForm } from './AddonEditForm';
import type { Addon } from '../types';

interface Props {
  addons: Addon[];
  editingAddonId: string | null;
  onAddAddon: () => void;
  onEditAddon: (id: string) => void;
  onUpdateAddon: (id: string, updates: Partial<Addon>) => void;
  onCancelEditAddon: () => void;
  onDeleteAddon: (id: string) => void;
}

export function AddonsSection({
  addons,
  editingAddonId,
  onAddAddon,
  onEditAddon,
  onUpdateAddon,
  onCancelEditAddon,
  onDeleteAddon,
}: Props) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-black tracking-tight mb-1">
        Add-ons
      </h2>
      <p className="text-gray-600 text-sm mb-4">
        Add additional services that customers can choose alongside the main
        service.
      </p>
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 text-black font-medium text-sm shadow-sm hover:bg-gray-100 mb-4"
        onClick={onAddAddon}
      >
        <HugeiconsIcon icon={Add01Icon} {...iconProps} size={18} />
        New Add-on
      </button>
      {addons.length > 0 && (
        <ul className="space-y-2">
          {addons.map((addon) => (
            <li key={addon.id} className="rounded-xl bg-gray-100 px-4 py-3">
              {editingAddonId === addon.id ? (
                <AddonEditForm
                  addon={addon}
                  onSave={(updates) => onUpdateAddon(addon.id, updates)}
                  onCancel={onCancelEditAddon}
                />
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-black">{addon.name}</span>
                  <span className="text-sm text-gray-700">£{addon.price}</span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-200"
                      aria-label="Edit add-on"
                      onClick={() => onEditAddon(addon.id)}
                    >
                      <HugeiconsIcon icon={Edit01Icon} {...iconProps} size={16} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded-lg hover:bg-gray-200 text-red-600 hover:text-red-700"
                      aria-label="Delete add-on"
                      onClick={() => onDeleteAddon(addon.id)}
                    >
                      <HugeiconsIcon icon={Delete01Icon} {...iconProps} size={16} />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
