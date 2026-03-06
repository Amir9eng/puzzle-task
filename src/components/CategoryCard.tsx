import { memo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowUp01Icon,
  Copy01Icon,
  Delete01Icon,
  Edit01Icon,
  File01Icon,
  LinkSquare01Icon,
} from '@hugeicons/core-free-icons';
import { iconProps } from '../utils';
import { ServiceEditForm } from './ServiceEditForm';
import type { Category, Service } from '../types';

interface Props {
  category: Category;
  isExpanded: boolean;
  editingCategoryId: string | null;
  editingServiceId: string | null;
  linkCopiedServiceId: string | null;
  onToggleExpand: (id: string) => void;
  onEditCategory: (id: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  onEditService: (id: string) => void;
  onUpdateService: (categoryId: string, serviceId: string, updates: Partial<Service>) => void;
  onCancelEditService: () => void;
  onDuplicateService: (categoryId: string, service: Service) => void;
  onCopyServiceLink: (serviceId: string) => void;
  onDeleteService: (categoryId: string, serviceId: string) => void;
}

export const CategoryCard = memo(function CategoryCard({
  category,
  isExpanded,
  editingCategoryId,
  editingServiceId,
  linkCopiedServiceId,
  onToggleExpand,
  onEditCategory,
  onUpdateCategory,
  onDeleteCategory,
  onEditService,
  onUpdateService,
  onCancelEditService,
  onDuplicateService,
  onCopyServiceLink,
  onDeleteService,
}: Props) {
  return (
    <section className="rounded-2xl bg-gray-100/90 shadow-sm mb-8">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          {editingCategoryId === category.id ? (
            <input
              type="text"
              defaultValue={category.name}
              className="flex-1 min-w-0 text-lg font-bold text-black border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent"
              autoFocus
              onBlur={(e) => onUpdateCategory(category.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
                if (e.key === 'Escape') onUpdateCategory(category.id, category.name);
              }}
            />
          ) : (
            <h2 className="text-lg font-bold text-black">{category.name}</h2>
          )}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
              aria-label="Edit category"
              onClick={() => onEditCategory(category.id)}
            >
              <HugeiconsIcon icon={Edit01Icon} {...iconProps} size={18} />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
              aria-label="Delete category"
              onClick={() => onDeleteCategory(category.id)}
            >
              <HugeiconsIcon icon={Delete01Icon} {...iconProps} size={18} />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
              aria-label="Toggle category"
              onClick={() => onToggleExpand(category.id)}
              style={{ transform: 'translateZ(0)' }}
            >
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                {...iconProps}
                size={18}
                style={{
                  display: 'block',
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 200ms ease',
                }}
              />
            </button>
          </div>
        </div>

        {/* Collapsible content — always mounted, collapsed via max-height */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isExpanded ? '9999px' : '0px',
            transition: isExpanded ? 'max-height 300ms ease-in' : 'max-height 200ms ease-out',
          }}
        >
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
                    onSave={(updates) => onUpdateService(category.id, service.id, updates)}
                    onCancel={onCancelEditService}
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-1 rounded-full bg-amber-700/80 shrink-0 self-stretch min-h-10" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-bold text-black">{service.name}</h3>
                          <p className="text-sm text-gray-700 mt-0.5">
                            {service.description || 'This is a fashion design agency'}
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
                            onClick={() => onEditService(service.id)}
                          >
                            <HugeiconsIcon icon={Edit01Icon} {...iconProps} size={16} />
                          </button>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                            aria-label="Duplicate"
                            onClick={() => onDuplicateService(category.id, service)}
                          >
                            <HugeiconsIcon icon={Copy01Icon} {...iconProps} size={16} />
                          </button>
                          <span className="relative inline-flex items-center">
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                              aria-label="Copy link"
                              onClick={() => onCopyServiceLink(service.id)}
                              title="Copy link to this service"
                            >
                              <HugeiconsIcon icon={LinkSquare01Icon} {...iconProps} size={16} />
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
                            onClick={() => onDeleteService(category.id, service.id)}
                          >
                            <HugeiconsIcon icon={Delete01Icon} {...iconProps} size={16} />
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
                          <HugeiconsIcon icon={File01Icon} {...iconProps} size={16} />
                          Intake Form
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
