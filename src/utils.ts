import type { Category, Service, Addon } from './types';

export const STORAGE_KEY = 'puzzle-services-data';

export const iconProps = { size: 20, color: 'currentColor', strokeWidth: 1.5 };

export function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export function defaultData(): { categories: Category[]; addons: Addon[] } {
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

function migrateService(service: Service): Service {
  const subServices = service.subServices ?? [];
  const needsNameAndDesc =
    service.name === 'New Service' && !service.description;
  const needsSubServices = subServices.length === 0;
  if (!needsNameAndDesc && !needsSubServices) return { ...service, subServices };
  return {
    ...service,
    name: needsNameAndDesc ? 'Fashion Design' : service.name,
    description: service.description || 'This is a fashion design agency',
    subServices: needsSubServices
      ? [{ id: generateId(), label: 'Logo Design', price: '0' }]
      : subServices,
  };
}

export function loadFromStorage(): { categories: Category[]; addons: Addon[] } {
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
        services: cat.services.map(migrateService),
      }));
      return { categories, addons: parsed.addons };
    }
  } catch {
    // ignore
  }
  return defaultData();
}
