'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  priority: 1 | 2 | 3;
  minWidth?: number;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
  onRowClick?: (row: T) => void;
}

export default function ResponsiveTable<T extends Record<string, any>>({
  columns,
  data,
  itemsPerPage = 10,
  onRowClick,
}: ResponsiveTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleColumns = columns.filter(col => !isMobile || col.priority === 1 || col.priority === 2);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const rowVirtualizer = useVirtualizer({
    count: Math.min(itemsPerPage, data.length - (currentPage - 1) * itemsPerPage),
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 48, []),
    overscan: 5,
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <div ref={parentRef} className="max-h-[400px] overflow-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {visibleColumns.map((column) => (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className={`
                      px-6 py-3
                      ${column.minWidth ? `min-w-[${column.minWidth}px]` : ''}
                    `}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = currentPageData[virtualRow.index];
                return (
                  <tr
                    key={virtualRow.index}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    onClick={() => onRowClick?.(row)}
                    data-testid={`transaction-${row.type?.toLowerCase()}`}
                    className={
                      onRowClick
                        ? 'cursor-pointer transition-colors hover:bg-gray-50'
                        : ''
                    }
                  >
                    {visibleColumns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination avec contrôles d'accessibilité */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Affichage de{' '}
              <span className="font-medium">{startIndex + 1}</span> à{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, data.length)}
              </span>{' '}
              sur <span className="font-medium">{data.length}</span> résultats
            </p>
          </div>

          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`
                relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium
                ${currentPage === 1
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }
                focus:z-20 focus:outline-none focus:ring-2 focus:ring-orange-500
              `}
              aria-label="Page précédente"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              <span className="ml-2">Précédent</span>
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`
                relative ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-medium
                ${currentPage === totalPages
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }
                focus:z-20 focus:outline-none focus:ring-2 focus:ring-orange-500
              `}
              aria-label="Page suivante"
            >
              <span className="mr-2">Suivant</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
