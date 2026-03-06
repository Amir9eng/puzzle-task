import { useState, useEffect, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Menu01Icon,
  MessageAdd01Icon,
  MoreVerticalIcon,
  Link01Icon,
  FolderAddIcon,
  Edit01Icon,
  Delete01Icon,
  ArrowUp01Icon,
  Copy01Icon,
  LinkSquare01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons';
import './index.css';

const iconProps = { size: 20, color: 'currentColor', strokeWidth: 1.5 };

const STORAGE_KEY = 'puzzle-services-data';

type SubService = { id: string; label: string; price: string };
type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  status: 'public' | 'private';
  subServices: SubService[];
};
type Category = { id: string; name: string; services: Service[] };
type Addon = { id: string; name: string; price: string };

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function defaultData(): { categories: Category[]; addons: Addon[] } {
  return {
    categories: [
      {
        id: 'cat-1',
        name: 'Technology',
        services: [
          {
            id: 'svc-1',
            name: 'Fashion Design',
            description: 'This is a fashion design agency',
            price: '0',
            status: 'public',
            subServices: [{ id: 'sub-1', label: 'Logo Design', price: '0' }],
          },
        ],
      },
    ],
    addons: [],
  };
}

function migrateServiceToDesignDefaults(service: Service): Service {
  const subServices = service.subServices ?? [];
  const needsNameAndDesc =
    service.name === 'New Service' && !service.description;
  const needsSubServices = subServices.length === 0;
  if (!needsNameAndDesc && !needsSubServices)
    return { ...service, subServices };
  return {
    ...service,
    name: needsNameAndDesc ? 'Fashion Design' : service.name,
    description: service.description || 'This is a fashion design agency',
    subServices: needsSubServices
      ? [{ id: generateId(), label: 'Logo Design', price: '0' }]
      : subServices,
  };
}

function loadFromStorage(): { categories: Category[]; addons: Addon[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as {
      categories: Category[];
      addons: Addon[];
    };
    if (Array.isArray(parsed.categories) && Array.isArray(parsed.addons)) {
      const categories = parsed.categories.map((cat) => ({
        ...cat,
        services: cat.services.map(migrateServiceToDesignDefaults),
      }));
      return { categories, addons: parsed.addons };
    }
  } catch {
    // ignore
  }
  return defaultData();
}

function ServiceEditForm({
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
        <div className="flex-1">
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
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Service['status'])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent"
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

function AddonEditForm({
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

function App() {
  const [categories, setCategories] = useState<Category[]>(() => []);
  const [addons, setAddons] = useState<Addon[]>(() => []);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [linkCopiedServiceId, setLinkCopiedServiceId] = useState<string | null>(
    null,
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const { categories: c, addons: a } = loadFromStorage();
    setCategories(c);
    setAddons(a);
    if (c.length > 0 && expandedCategoryIds.size === 0) {
      setExpandedCategoryIds(new Set([c[0].id]));
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever data or expanded state changes (after first load)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, addons }));
    } catch {
      // ignore
    }
  }, [hydrated, categories, addons]);

  // Ensure at least one category is expanded when we have categories
  useEffect(() => {
    if (!hydrated || categories.length === 0) return;
    if (expandedCategoryIds.size === 0) {
      setExpandedCategoryIds(new Set([categories[0].id]));
    }
  }, [hydrated, categories, expandedCategoryIds.size]);

  const toggleCategoryExpanded = useCallback((id: string) => {
    setExpandedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const copyLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      setCopyFeedback(false);
    }
  }, []);

  const addCategory = useCallback(() => {
    setCategories((prev) => [
      ...prev,
      {
        id: generateId(),
        name: 'New Category',
        services: [],
      },
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
                  subServices: [
                    { id: generateId(), label: 'Logo Design', price: '0' },
                  ],
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

  const duplicateService = useCallback(
    (categoryId: string, service: Service) => {
      const copy: Service = {
        ...service,
        id: generateId(),
        name: `${service.name} (copy)`,
        subServices: service.subServices.map((sub) => ({
          ...sub,
          id: generateId(),
        })),
      };
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, services: [...cat.services, copy] }
            : cat,
        ),
      );
    },
    [],
  );

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

  const updateAddon = useCallback(
    (addonId: string, updates: Partial<Addon>) => {
      setAddons((prev) =>
        prev.map((a) => (a.id === addonId ? { ...a, ...updates } : a)),
      );
      setEditingAddonId(null);
    },
    [],
  );

  const addAddon = useCallback(() => {
    setAddons((prev) => [
      ...prev,
      { id: generateId(), name: 'New Add-on', price: '0' },
    ]);
  }, []);

  const deleteAddon = useCallback((id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Add service to first category (when clicking "New Service" in header)
  const addServiceToFirstCategory = useCallback(() => {
    if (categories.length === 0) {
      const newCatId = generateId();
      const newService: Service = {
        id: generateId(),
        name: 'Fashion Design',
        description: 'This is a fashion design agency',
        price: '0',
        status: 'public',
        subServices: [{ id: generateId(), label: 'Logo Design', price: '0' }],
      };
      setCategories((prev) => [
        ...prev,
        { id: newCatId, name: 'New Category', services: [newService] },
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
      {/* Top nav */}
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

        {/* Category cards */}
        {categories.map((category) => {
          const isExpanded = expandedCategoryIds.has(category.id);
          return (
            <section
              key={category.id}
              className="rounded-2xl bg-gray-100/90 shadow-sm overflow-hidden mb-8"
            >
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  {editingCategoryId === category.id ? (
                    <input
                      type="text"
                      defaultValue={category.name}
                      className="flex-1 min-w-0 text-lg font-bold text-black border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent"
                      autoFocus
                      onBlur={(e) =>
                        updateCategory(category.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                        if (e.key === 'Escape') {
                          setEditingCategoryId(null);
                        }
                      }}
                    />
                  ) : (
                    <h2 className="text-lg font-bold text-black">
                      {category.name}
                    </h2>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                      aria-label="Edit category"
                      onClick={() => setEditingCategoryId(category.id)}
                    >
                      <HugeiconsIcon
                        icon={Edit01Icon}
                        {...iconProps}
                        size={18}
                      />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                      aria-label="Delete category"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <HugeiconsIcon
                        icon={Delete01Icon}
                        {...iconProps}
                        size={18}
                      />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      onClick={() => toggleCategoryExpanded(category.id)}
                    >
                      <HugeiconsIcon
                        icon={ArrowUp01Icon}
                        {...iconProps}
                        size={18}
                        style={{
                          transform: isExpanded ? 'none' : 'rotate(180deg)',
                        }}
                      />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200/80 space-y-4">
                    {category.services.map((service) => (
                      <div
                        key={service.id}
                        id={`service-${service.id}`}
                        className="rounded-xl bg-white p-4 shadow-sm scroll-mt-4"
                      >
                        {editingServiceId === service.id ? (
                          <ServiceEditForm
                            service={service}
                            onSave={(updates) =>
                              updateService(category.id, service.id, updates)
                            }
                            onCancel={() => setEditingServiceId(null)}
                          />
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="w-1 rounded-full bg-amber-700/80 shrink-0 self-stretch min-h-10" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div>
                                  <h3 className="font-bold text-black">
                                    {service.name}
                                  </h3>
                                  <p className="text-sm text-gray-700 mt-0.5">
                                    {service.description ||
                                      'This is a fashion design agency'}
                                  </p>
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  £{service.price}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-100 text-gray-700 text-xs font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                  {service.status}
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                                    aria-label="Edit"
                                    onClick={() =>
                                      setEditingServiceId(service.id)
                                    }
                                  >
                                    <HugeiconsIcon
                                      icon={Edit01Icon}
                                      {...iconProps}
                                      size={16}
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                                    aria-label="Duplicate"
                                    onClick={() =>
                                      duplicateService(category.id, service)
                                    }
                                  >
                                    <HugeiconsIcon
                                      icon={Copy01Icon}
                                      {...iconProps}
                                      size={16}
                                    />
                                  </button>
                                  <span className="relative inline-flex items-center">
                                    <button
                                      type="button"
                                      className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                                      aria-label="Copy link"
                                      onClick={() =>
                                        copyServiceLink(service.id)
                                      }
                                      title="Copy link to this service"
                                    >
                                      <HugeiconsIcon
                                        icon={LinkSquare01Icon}
                                        {...iconProps}
                                        size={16}
                                      />
                                    </button>
                                    {linkCopiedServiceId === service.id && (
                                      <span className="absolute left-full ml-1 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium whitespace-nowrap">
                                        Copied!
                                      </span>
                                    )}
                                  </span>
                                  <button
                                    type="button"
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-red-600 hover:text-red-700"
                                    aria-label="Delete"
                                    onClick={() =>
                                      deleteService(category.id, service.id)
                                    }
                                  >
                                    <HugeiconsIcon
                                      icon={Delete01Icon}
                                      {...iconProps}
                                      size={16}
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  {service.subServices.map((sub) => (
                                    <span
                                      key={sub.id}
                                      className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-200/90 text-gray-700 text-xs font-medium"
                                    >
                                      {sub.label} £{sub.price}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 shrink-0 ml-auto"
                                >
                                  <HugeiconsIcon
                                    icon={File01Icon}
                                    {...iconProps}
                                    size={16}
                                  />
                                  Intake Form
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* Add-ons */}
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
            onClick={addAddon}
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
                      onSave={(updates) => updateAddon(addon.id, updates)}
                      onCancel={() => setEditingAddonId(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-black">
                        {addon.name}
                      </span>
                      <span className="text-sm text-gray-700">
                        £{addon.price}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-200"
                          aria-label="Edit add-on"
                          onClick={() => setEditingAddonId(addon.id)}
                        >
                          <HugeiconsIcon
                            icon={Edit01Icon}
                            {...iconProps}
                            size={16}
                          />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg hover:bg-gray-200 text-red-600 hover:text-red-700"
                          aria-label="Delete add-on"
                          onClick={() => deleteAddon(addon.id)}
                        >
                          <HugeiconsIcon
                            icon={Delete01Icon}
                            {...iconProps}
                            size={16}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
