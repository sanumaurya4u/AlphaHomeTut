import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import EmptyState from './EmptyState';
import { PAGE_SIZE_OPTIONS } from '@/constants';

export default function DataTable({
  columns = [], data = [], loading = false, searchPlaceholder = 'Search...',
  onSearch, searchValue, filters = [], onFilterChange, filterValues = {},
  page = 1, totalPages = 1, pageSize = 10, onPageChange, onPageSizeChange,
  onSort, sortBy, sortOrder, onExport, emptyMessage, totalCount = 0,
  renderActions,
}) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {onSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 focus:bg-white transition-all outline-none"
              />
            </div>
          )}
          {filters.map((f) => (
            <select
              key={f.key}
              value={filterValues[f.key] || ''}
              onChange={(e) => onFilterChange?.(f.key, e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-primary/30"
            >
              <option value="">{f.label}</option>
              {f.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ))}
        </div>
        {onExport && (
          <button onClick={onExport} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-gray-700 select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortBy === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
              {renderActions && <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                  {renderActions && <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded-lg animate-pulse w-16 ml-auto" /></td>}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)}>
                  <EmptyState title={emptyMessage || 'No records found'} />
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] || '—')}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-3.5 text-right">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            {totalCount > 0 ? `Showing ${from}–${to} of ${totalCount}` : 'No results'}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} / page</option>)}
            </select>
            <button onClick={() => onPageChange?.(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 px-2">{page} / {totalPages || 1}</span>
            <button onClick={() => onPageChange?.(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
