import { useState, useEffect, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Menu01Icon,
  MessageAdd01Icon,
  MoreVerticalIcon,
  Link01Icon,
  FolderAddIcon,
} from '@hugeicons/core-free-icons';
import { CategoryCard } from './components/CategoryCard';
import { AddonsSection } from './components/AddonsSection';
import { generateId, iconProps, loadFromStorage, STORAGE_KEY } from './utils';
import type { Addon, Category, Service } from './types';
import './index.css';

function App() {
  const [categories, setCategories] = useState<Category[]>(() => []);
  const [addons, setAddons] = useState<Addon[]>(() => []);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [linkCopiedServiceId, setLinkCopiedServiceId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const { categories: c, addons: a } = loadFromStorage();
    setCategories(c);
    setAddons(a);
    if (c.length > 0) setExpandedCategoryIds(new Set([c[0].id]));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, addons }));
    } catch {
      // ignore
    }
  }, [hydrated, categories, addons]);

const toggleCategoryExpanded = useCallback((id: string) => {
    setExpandedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      setCopyFeedback(false);
    }
  }, []);

  const addCategory = useCallback(() => {
    setCategories((prev) => [
      ...prev,
      { id: generateId(), name: 'New Category', services: [] },
    ]);
  }, []);

  const addService = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              services: [
                ...cat.services,
                {
                  id: generateId(),
                  name: 'Fashion Design',
                  description: 'This is a fashion design agency',
                  price: '0',
                  status: 'public' as const,
                  subServices: [{ id: generateId(), label: 'Logo Design', price: '0' }],
                },
              ],
            }
          : cat,
      ),
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setExpandedCategoryIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const deleteService = useCallback((categoryId: string, serviceId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, services: cat.services.filter((s) => s.id !== serviceId) }
          : cat,
      ),
    );
  }, []);

  const updateCategory = useCallback((categoryId: string, name: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, name: name.trim() || cat.name } : cat,
      ),
    );
    setEditingCategoryId(null);
  }, []);

  const updateService = useCallback(
    (categoryId: string, serviceId: string, updates: Partial<Service>) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                services: cat.services.map((s) =>
                  s.id === serviceId ? { ...s, ...updates } : s,
                ),
              }
            : cat,
        ),
      );
      setEditingServiceId(null);
    },
    [],
  );

  const duplicateService = useCallback((categoryId: string, service: Service) => {
    const copy: Service = {
      ...service,
      id: generateId(),
      name: `${service.name} (copy)`,
      subServices: service.subServices.map((sub) => ({ ...sub, id: generateId() })),
    };
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, services: [...cat.services, copy] } : cat,
      ),
    );
  }, []);

  const copyServiceLink = useCallback(async (serviceId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#service-${serviceId}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopiedServiceId(serviceId);
      setTimeout(() => setLinkCopiedServiceId(null), 2000);
    } catch {
      // ignore
    }
  }, []);

  const updateAddon = useCallback((addonId: string, updates: Partial<Addon>) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === addonId ? { ...a, ...updates } : a)),
    );
    setEditingAddonId(null);
  }, []);

  const addAddon = useCallback(() => {
    setAddons((prev) => [
      ...prev,
      { id: generateId(), name: 'New Add-on', price: '0' },
    ]);
  }, []);

  const deleteAddon = useCallback((id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addServiceToFirstCategory = useCallback(() => {
    if (categories.length === 0) {
      const newCatId = generateId();
      setCategories((prev) => [
        ...prev,
        {
          id: newCatId,
          name: 'New Category',
          services: [
            {
              id: generateId(),
              name: 'Fashion Design',
              description: 'This is a fashion design agency',
              price: '0',
              status: 'public',
              subServices: [{ id: generateId(), label: 'Logo Design', price: '0' }],
            },
          ],
        },
      ]);
      setExpandedCategoryIds((prev) => new Set(prev).add(newCatId));
    } else {
      addService(categories[0].id);
      setExpandedCategoryIds((prev) => new Set(prev).add(categories[0].id));
    }
  }, [categories, addService]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop&crop=faces"
          alt=""
          className="w-10 h-10 rounded-full object-cover shrink-0 bg-gray-200"
          loading="lazy"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200"
            aria-label="Messages"
          >
            <HugeiconsIcon icon={MessageAdd01Icon} {...iconProps} />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200"
            aria-label="Menu"
          >
            <HugeiconsIcon icon={Menu01Icon} {...iconProps} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-12">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1 className="text-2xl font-bold text-black tracking-tight">
              Services
            </h1>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 shrink-0"
              aria-label="More options"
            >
              <HugeiconsIcon icon={MoreVerticalIcon} {...iconProps} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ec4899] text-white font-medium text-sm shadow-sm hover:bg-[#db2777]"
              onClick={addServiceToFirstCategory}
            >
              <HugeiconsIcon icon={Add01Icon} {...iconProps} size={18} />
              New Service
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-medium text-sm hover:bg-gray-200"
              onClick={copyLink}
            >
              <HugeiconsIcon icon={Link01Icon} {...iconProps} size={18} />
              {copyFeedback ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-medium text-sm hover:bg-gray-200"
              onClick={addCategory}
            >
              <HugeiconsIcon icon={FolderAddIcon} {...iconProps} size={18} />
              New Cate
            </button>
          </div>
        </div>

        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isExpanded={expandedCategoryIds.has(category.id)}
            editingCategoryId={editingCategoryId}
            editingServiceId={editingServiceId}
            linkCopiedServiceId={linkCopiedServiceId}
            onToggleExpand={toggleCategoryExpanded}
            onEditCategory={setEditingCategoryId}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onEditService={setEditingServiceId}
            onUpdateService={updateService}
            onCancelEditService={() => setEditingServiceId(null)}
            onDuplicateService={duplicateService}
            onCopyServiceLink={copyServiceLink}
            onDeleteService={deleteService}
          />
        ))}

        <AddonsSection
          addons={addons}
          editingAddonId={editingAddonId}
          onAddAddon={addAddon}
          onEditAddon={setEditingAddonId}
          onUpdateAddon={updateAddon}
          onCancelEditAddon={() => setEditingAddonId(null)}
          onDeleteAddon={deleteAddon}
        />
      </main>
    </div>
  );
}

export default App;
