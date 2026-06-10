import { type ReactNode } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface PageTableProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: ReactNode;
  searchValue?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  getKey: (row: T) => string | number;
}

export function PageTable<T>({
  title,
  subtitle,
  columns,
  data,
  loading,
  emptyMessage = 'Aucune donnée',
  actions,
  searchValue,
  onSearch,
  searchPlaceholder = 'Rechercher...',
  getKey,
}: PageTableProps<T>) {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>{actions}</div>}
      </div>

      {onSearch && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-body" style={{ padding: '0.875rem 1.25rem' }}>
            <div className="search-wrapper">
              <FiSearch size={15} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={e => onSearch(e.target.value)}
              />
              {searchValue && (
                <button
                  onClick={() => onSearch('')}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 0,
                  }}
                >
                  <FiX size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '36px', height: '36px',
                border: '3px solid var(--border)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement des données...</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col.key} style={{ textAlign: col.align ?? 'left' }}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  data.map(row => (
                    <tr key={getKey(row)}>
                      {columns.map(col => (
                        <td key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                          {col.render ? col.render(row) : String((row as any)[col.key] ?? '-')}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        {!loading && data.length > 0 && (
          <div style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}>
            {data.length} enregistrement{data.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
