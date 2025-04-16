import { useState, useEffect } from 'react';
import { TablaMinutas } from '../components/TablaMinutas';
import { TablaMinutasConAcciones } from '../components/TablaMinutasConAcciones';
import LayoutDashboard from '../components/LayoutDashboard';



export default function Home() {
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [todas, setTodas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [asistentes, setAsistentes] = useState('');
  const [tags, setTags] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [boletin, setBoletin] = useState('');
  const [comision, setComision] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [tramite, setTramite] = useState('');
  const [estadoBoletin, setEstadoBoletin] = useState('');
  const [origen, setOrigen] = useState('');
  const [detalle, setDetalle] = useState('');
  const [boletinBusqueda, setBoletinBusqueda] = useState('');
  const [resultadosBoletin, setResultadosBoletin] = useState([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [resultadosFecha, setResultadosFecha] = useState([]);
  const [comisionFiltro, setComisionFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [resultadosFiltro, setResultadosFiltro] = useState([]);
  const [boletinSeleccionado, setBoletinSeleccionado] = useState(null);
  const [minutasVisibles, setMinutasVisibles] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarJson, setMostrarJson] = useState(false);
  const [jsonData, setJsonData] = useState('');


  const buscar = async () => {
    const res = await fetch('/api/buscar?q=' + encodeURIComponent(q));
    const data = await res.json();
    setResultados(data);
    setMinutasVisibles(data);
  };

  const buscarPorBoletin = async () => {
    const res = await fetch('/api/buscarBoletin?boletin=' + encodeURIComponent(boletinBusqueda));
    const data = await res.json();
    setResultadosBoletin(data);
    setMinutasVisibles(data);
  };

  const buscarPorFecha = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert('Selecciona ambas fechas');
      return;
    }
  
    const res = await fetch(`/api/buscarPorFecha?desde=${fechaDesde}&hasta=${fechaHasta}`);
    const data = await res.json();
    setResultadosFecha(data);
    setMinutasVisibles(data);
  };  

  const buscarPorComisionTipo = async () => {
    const params = new URLSearchParams();
    if (comisionFiltro) params.append('comision', comisionFiltro);
    if (tipoFiltro) params.append('tipo', tipoFiltro);
  
    const res = await fetch('/api/buscarPorComisionTipo?' + params.toString());
    const data = await res.json();
    setResultadosFiltro(data);
    setMinutasVisibles(data);
  };  

  const guardar = async () => {
    const datos = {
      titulo,
      contenido,
      asistentes: asistentes.split(',').map(a => a.trim()),
      tags: tags.split(',').map(t => t.trim()),
      proyecto,
      fecha: new Date().toISOString(),
      boletin,
      comision,
      tipo_evento: tipoEvento,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      urgencia,
      tramite,
      estado: estadoBoletin,
      origen,
      detalle
    };
  
    console.log('🟢 Datos enviados:', datos); // ← DEBUG
  
    if (modoEdicion && idEditando) {
      await fetch(`/api/minutas?id=${idEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      setMensaje('✅ Minuta actualizada');
    } else {
      await fetch('/api/minutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      setMensaje('✅ Minuta guardada');
    }
  
    setTitulo('');
    setContenido('');
    setAsistentes('');
    setTags('');
    setProyecto('');
    setBoletin('');
    setComision('');
    setTipoEvento('');
    setHoraInicio('');
    setHoraFin('');
    setUrgencia('');
    setTramite('');
    setEstadoBoletin('');
    setOrigen('');
    setDetalle('');
    setModoEdicion(false);
    setIdEditando(null);
  
    await new Promise(resolve => setTimeout(resolve, 300));
    await obtenerTodas();
    setTimeout(() => setMensaje(''), 3000);
  };
  
  
  
  
  const eliminarMinuta = async (id) => {
    if (!confirm('¿Estás seguro que quieres eliminar esta minuta?')) return;
  
    const res = await fetch('/api/eliminar?id=' + id, { method: 'DELETE' });
  
    if (res.ok) {
      setMensaje('✅ Minuta eliminada correctamente');
      setTodas(todas.filter((minuta) => minuta.id !== id));
    } else {
      setMensaje('❌ Error al eliminar la minuta');
    }
  
    setTimeout(() => setMensaje(''), 5000);
  };

  const obtenerTodas = async () => {
    const res = await fetch('/api/todas');
    const data = await res.json();
    setTodas([...data]);
    setMinutasVisibles(data);
  };

  const editarMinuta = (minuta) => {
    setModoEdicion(true);
    setIdEditando(minuta.id);
  
    setTitulo(minuta.titulo || '');
    setContenido(minuta.contenido || '');
    setAsistentes(minuta.asistentes?.join(', ') || '');
    setTags(minuta.tags?.join(', ') || '');
    setProyecto(minuta.proyecto || '');
  
    setBoletin(minuta.boletin || '');
    setComision(minuta.comision || '');
    setTipoEvento(minuta.tipo_evento || '');
    setHoraInicio(minuta.hora_inicio || '');
    setHoraFin(minuta.hora_fin || '');
    setUrgencia(minuta.urgencia || '');
    setTramite(minuta.tramite || '');
    setEstadoBoletin(minuta.estado || '');
    setOrigen(minuta.origen || '');
    setDetalle(minuta.detalle || '');
  };

  useEffect(() => {
    obtenerTodas(); // al cargar la página
  }, []);

  const agruparPorFecha = (minutas) => {
    const grupos = {};
  
    minutas.forEach((minuta) => {
      const fechaLegible = new Date(minuta.fecha).toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
      if (!grupos[fechaLegible]) {
        grupos[fechaLegible] = [];
      }
  
      grupos[fechaLegible].push(minuta);
    });
  
    return grupos;
  };
  
  const resultadosAgrupados = agruparPorFecha(resultadosFecha);

  return (
    <LayoutDashboard>
      <main className="min-h-screen bg-base-200 p-6 font-sans">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="card bg-base-100 shadow-xl p-6 space-y-6">
            <h1 className="text-3xl font-bold text-primary">📋 Minutas</h1>

            {mensaje && (
              <div className="alert alert-success">
                <span>{mensaje}</span>
              </div>
            )}

            <div className="divider">➕ Agregar nueva</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="input input-bordered w-full" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Asistentes" value={asistentes} onChange={e => setAsistentes(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Tags" value={tags} onChange={e => setTags(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Proyecto" value={proyecto} onChange={e => setProyecto(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Boletín" value={boletin} onChange={e => setBoletin(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Comisión o Sala" value={comision} onChange={e => setComision(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Tipo de evento" value={tipoEvento} onChange={e => setTipoEvento(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Hora inicio" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Hora fin" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Urgencia" value={urgencia} onChange={e => setUrgencia(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Trámite" value={tramite} onChange={e => setTramite(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Estado boletín" value={estadoBoletin} onChange={e => setEstadoBoletin(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Origen" value={origen} onChange={e => setOrigen(e.target.value)} />
            </div>

            <textarea className="textarea textarea-bordered w-full mt-4" placeholder="Contenido" rows={3} value={contenido} onChange={e => setContenido(e.target.value)} />
            <textarea className="textarea textarea-bordered w-full" placeholder="Detalle del evento" rows={3} value={detalle} onChange={e => setDetalle(e.target.value)} />

            <div className="mt-4">
              <button className="btn btn-primary" onClick={guardar}>
                {modoEdicion ? 'Actualizar' : 'Guardar'}
              </button>

              <button className="btn btn-outline" onClick={() => document.getElementById('modal_importar').showModal()}>
                Importar
              </button>
            </div>

            <div className="divider">🔎 Buscar minutas</div>

            <div className="flex flex-wrap gap-4 items-end">
              <input className="input input-bordered max-w-xs" placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} />
              <button className="btn btn-secondary" onClick={buscar}>Buscar</button>
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={() => setMostrarFiltros(prev => !prev)}
            >
              {mostrarFiltros ? 'Ocultar filtros' : 'Más filtros'}
            </button>

            {mostrarFiltros && (
            <>

            <div className="form-control mt-4">
              <label className="label"><span className="label-text">Buscar por boletín</span></label>
              <div className="flex gap-2">
                <input className="input input-bordered" value={boletinBusqueda} onChange={e => setBoletinBusqueda(e.target.value)} placeholder="Ej: 17169-04" />
                <button className="btn" onClick={buscarPorBoletin}>Buscar</button>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {resultadosBoletin.map((r, i) => (
                <li key={i} className="p-4 bg-base-100 rounded-lg shadow border">
                  <strong>{r.titulo}</strong><br />
                  <small>Boletín: {r.boletin}</small><br />
                  {r.comision && <p><strong>Comisión:</strong> {r.comision}</p>}
                  {r.fecha && <p><strong>Fecha:</strong> {r.fecha}</p>}
                  <button className="btn btn-sm btn-outline mt-2" onClick={() => setBoletinSeleccionado(r)}>
                    Ver detalles
                  </button>
                </li>
              ))}
            </ul>

            {boletinSeleccionado && (
              <div className="card bg-base-100 p-4 shadow mt-6">
                <h3 className="card-title">📄 Detalle del boletín</h3>
                <div className="mt-2 space-y-1">
                  <p><strong>Título:</strong> {boletinSeleccionado.titulo}</p>
                  <p><strong>Boletín:</strong> {boletinSeleccionado.boletin}</p>
                  <p><strong>Fecha:</strong> {boletinSeleccionado.fecha}</p>
                  <p><strong>Comisión:</strong> {boletinSeleccionado.comision}</p>
                  <p><strong>Tipo de evento:</strong> {boletinSeleccionado.tipo_evento}</p>
                  <p><strong>Trámite:</strong> {boletinSeleccionado.tramite}</p>
                  <p><strong>Urgencia:</strong> {boletinSeleccionado.urgencia}</p>
                  <p><strong>Estado:</strong> {boletinSeleccionado.estado}</p>
                  <p><strong>Origen:</strong> {boletinSeleccionado.origen}</p>
                  <p><strong>Horario:</strong> {boletinSeleccionado.hora_inicio} - {boletinSeleccionado.hora_fin}</p>
                  <p><strong>Contenido:</strong> {boletinSeleccionado.contenido}</p>
                  <p><strong>Detalle:</strong> {boletinSeleccionado.detalle}</p>
                </div>
                <div className="mt-4">
                  <button className="btn btn-outline btn-error" onClick={() => setBoletinSeleccionado(null)}>
                    ❌ Cerrar detalle
                  </button>
                </div>
              </div>
            )}

            <div className="divider">📅 Buscar por fecha</div>

            <div className="flex gap-4">
              <input type="date" className="input input-bordered" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
              <input type="date" className="input input-bordered" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
              <button className="btn" onClick={buscarPorFecha}>Buscar</button>
            </div>

            <section className="space-y-6">
              {Object.entries(resultadosAgrupados).map(([fecha, items], index) => (
                <div key={index} className="card bg-base-100 p-4 border shadow">
                  <h3 className="text-lg font-semibold text-primary mb-2">📅 {fecha}</h3>
                  <TablaMinutasConAcciones data={items} />
                </div>
              ))}
            </section>

            <div className="divider">🎯 Filtrar por Comisión y/o Tipo de Evento</div>

            <div className="flex flex-wrap gap-4">
              <select className="select select-bordered" value={comisionFiltro} onChange={e => setComisionFiltro(e.target.value)}>
                <option value="">-- Comisión --</option>
                <option value="Educación - Cámara">Educación - Cámara</option>
                <option value="Hacienda - Senado">Hacienda - Senado</option>
                <option value="Sala de la Cámara">Sala de la Cámara</option>
              </select>

              <select className="select select-bordered" value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
                <option value="">-- Tipo de evento --</option>
                <option value="comisión">Comisión</option>
                <option value="sala">Sala</option>
                <option value="investigadora">Investigadora</option>
              </select>

              <button className="btn" onClick={buscarPorComisionTipo}>Buscar</button>
            </div>

            </>
            )}

            <ul className="mt-4 space-y-2">
              {resultadosFiltro.map((r, i) => (
                <li key={i} className="border p-3 rounded">
                  <strong>{r.titulo}</strong><br />
                  <small>{r.fecha}</small><br />
                  {r.comision && <p><strong>Comisión:</strong> {r.comision}</p>}
                  {r.tipo_evento && <p><strong>Tipo:</strong> {r.tipo_evento}</p>}
                  {r.boletin && <p><strong>Boletín:</strong> {r.boletin}</p>}
                  {r.contenido}
                </li>
              ))}
            </ul>

            <div className="divider">📚 {q || boletinBusqueda || fechaDesde || comisionFiltro || tipoFiltro ? 'Resultados filtrados' : 'Todas las minutas guardadas'}</div>

            <TablaMinutasConAcciones
              data={minutasVisibles}
              onEditar={editarMinuta}
              onEliminar={eliminarMinuta}
              onVerDetalle={(minuta) => setBoletinSeleccionado(minuta)}
            />
          </div>
        </div>
        

        <dialog id="modal_importar" className="modal">
          <div className="modal-box w-full max-w-xl space-y-4">
            <h3 className="font-bold text-lg">📥 Importar minuta</h3>
            <div className="flex gap-4">
              <button className="btn btn-accent" onClick={() => document.getElementById('fileInput').click()}>
                Subir PDF
              </button>
              <button className="btn btn-info" onClick={() => setMostrarJson(true)}>
                Cargar Data
              </button>
            </div>

            {/* PDF hidden input */}
            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // 👇 aquí haces lo que quieras con el PDF
                  console.log("PDF seleccionado:", file);
                }
              }}
            />

            {/* Cuadro JSON dinámico */}
            {mostrarJson && (
              <div className="space-y-2">
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={6}
                  placeholder="Pega aquí el JSON..."
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={async () => {
                    try {
                      const docs = JSON.parse(jsonData);
                
                      for (const item of docs) {
                        const response = await fetch('/api/minutas', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(item.document)
                        });
                
                        if (!response.ok) {
                          throw new Error(`Error al guardar documento: ${response.status}`);
                        }
                      }
                
                      alert("Minutas importadas correctamente ✅");
                      setMostrarJson(false);
                      setJsonData('');
                      document.getElementById('modal_importar').close();
                    } catch (err) {
                      console.error(err);
                      alert("Error al importar: JSON inválido o problema con Elasticsearch.");
                    }
                  }}
                >
                  Cargar
                </button>
              </div>
            )}

            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Cerrar</button>
              </form>
            </div>
          </div>
        </dialog>
        
        <button
          className="btn btn-circle btn-primary fixed bottom-6 right-6 shadow-lg"
          onClick={() => document.getElementById('modal_ia').showModal()}
        >
          🤖
        </button>

        <dialog id="modal_ia" className="modal">
          <div className="modal-box w-full max-w-2xl space-y-4">
            <h3 className="font-bold text-lg">Asistente IA 🧠</h3>

            <p className="text-sm text-base-content">
              Haz una pregunta sobre cómo usar esta aplicación o sobre minutas legislativas.
            </p>

            <textarea
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="Escribe tu pregunta aquí..."
            />

            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Cerrar</button>
              </form>
              <button className="btn btn-primary">Enviar</button>
            </div>
          </div>
        </dialog>



      </main>
    </LayoutDashboard>
  );
}
