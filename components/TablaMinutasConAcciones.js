import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export function TablaMinutasConAcciones({ data, onEditar, onEliminar, onVerDetalle }) {
  const [filaExpandida, setFilaExpandida] = React.useState(null);
  const [columnFilters, setColumnFilters] = React.useState([]);

  const columns = [
    columnHelper.accessor('titulo', {
      header: 'Título',
      filterFn: 'auto'
    }),
    columnHelper.accessor('boletin', {
      header: 'Boletín',
      filterFn: 'auto',
      cell: ({ row, getValue }) => {
        const r = row.original;
        return (
          <div className="flex items-center gap-2">
            <span>{getValue()}</span>
            <button onClick={() => setFilaExpandida(r.id === filaExpandida ? null : r.id)} className="btn btn-xs btn-outline btn-info">👁</button>
          </div>
        );
      }
    }),
    columnHelper.accessor('comision', {
      header: 'Comisión',
      filterFn: 'auto'
    }),
    columnHelper.accessor('urgencia', {
      header: 'Urgencia',
      filterFn: 'auto'
    }),
    columnHelper.accessor('tipo_evento', {
      header: 'Tipo',
      filterFn: 'auto'
    }),
    columnHelper.accessor(row => `${row.hora_inicio || ''} - ${row.hora_fin || ''}`, {
      id: 'horario',
      header: 'Horario'
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex gap-2">
            <button onClick={() => onEditar(r)} className="btn btn-xs btn-outline btn-warning">✏</button>
            <button onClick={() => onEliminar(r.id)} className="btn btn-xs btn-outline btn-error">🗑</button>
          </div>
        );
      }
    })
  ];

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full bg-base-100 rounded-lg shadow">
        <thead className="bg-base-200 text-base-content">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="text-sm font-semibold text-base-content px-4 py-2">
                  <div className="flex flex-col gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanFilter() && (
                      <input
                        type="text"
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                        placeholder="Filtrar..."
                        className="input input-bordered input-xs w-full"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            const r = row.original;
            return (
              <React.Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>

                {filaExpandida === r.id && (
                  <tr>
                    <td colSpan={columns.length} className="bg-base-100 text-base-content">
                      <div className="p-4 space-y-1">
                        <p><span className="font-bold">Contenido:</span> {r.contenido}</p>
                        <p><span className="font-bold">Detalle:</span> {r.detalle}</p>
                        <p><span className="font-bold">Asistentes:</span> {r.asistentes?.join(', ')}</p>
                        <p><span className="font-bold">Tags:</span> {r.tags?.join(', ')}</p>
                        <p><span className="font-bold">Proyecto:</span> {r.proyecto}</p>
                        <p><span className="font-bold">Estado:</span> {r.estado}</p>
                        <p><span className="font-bold">Origen:</span> {r.origen}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}