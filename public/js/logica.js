// Lógica pura del sitio (sin DOM) para poder probarla con Vitest.

export const TALLER = {
  nombre: 'Auto Empire Taller',
  whatsapp: '50762589348',
  telefonoVisible: '6258-9348',
  correo: 'autoempiretaller@gmail.com',
  instagram: 'https://www.instagram.com/autoempiretaller/',
  mapa: 'https://maps.app.goo.gl/CoUamokjvQBxsYCZ7',
  direccion: 'Av. La Paz, local 72B, El Ingenio, Panamá',
  zonaHoraria: 'America/Panama',
  // Horario DE EJEMPLO para la propuesta. Confirmar con el taller.
  // Clave = día de la semana (0 domingo … 6 sábado). Sin clave = cerrado.
  horario: {
    1: ['08:00', '17:00'],
    2: ['08:00', '17:00'],
    3: ['08:00', '17:00'],
    4: ['08:00', '17:00'],
    5: ['08:00', '17:00'],
    6: ['08:00', '12:00'],
  },
};

export const INTERVALOS_ACEITE = {
  convencional: 5000,
  semisintetico: 7500,
  sintetico: 10000,
};

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** Arma el enlace de WhatsApp con el texto ya escrito. */
export function urlWhatsApp(texto = '', numero = TALLER.whatsapp) {
  const base = `https://wa.me/${numero}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

/** Devuelve el teléfono panameño en formato 6000-0000 / 200-0000, o null si no es válido. */
export function normalizarTelefono(valor = '') {
  let digitos = String(valor).replace(/\D/g, '');
  if (digitos.startsWith('507') && digitos.length > 8) digitos = digitos.slice(3);
  if (digitos.length === 8) return `${digitos.slice(0, 4)}-${digitos.slice(4)}`;
  if (digitos.length === 7) return `${digitos.slice(0, 3)}-${digitos.slice(3)}`;
  return null;
}

/** Fecha ISO (AAAA-MM-DD) → objeto con día de la semana, sin depender de la zona horaria. */
function partesFecha(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return null;
  const [anio, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  if (fecha.getUTCMonth() !== mes - 1) return null;
  return { anio, mes, dia, diaSemana: fecha.getUTCDay() };
}

/** "2026-10-24" → "sábado 24 de octubre" */
export function fechaLegible(iso) {
  const p = partesFecha(iso);
  if (!p) return '';
  return `${DIAS[p.diaSemana]} ${p.dia} de ${MESES[p.mes - 1]}`;
}

/** Fecha de hoy en Panamá como AAAA-MM-DD. */
export function hoyEnPanama(ahora = new Date()) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: TALLER.zonaHoraria, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(ahora);
  const get = (t) => partes.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Valida la orden de servicio. Devuelve { valido, errores: { campo: mensaje } }. */
export function validarReserva(datos = {}, hoy = hoyEnPanama(), horario = TALLER.horario) {
  const errores = {};
  if (!datos.nombre || datos.nombre.trim().length < 2) {
    errores.nombre = 'Escribe tu nombre.';
  }
  if (!normalizarTelefono(datos.telefono)) {
    errores.telefono = 'Escribe un número de 7 u 8 dígitos, por ejemplo 6000-0000.';
  }
  if (!datos.vehiculo || datos.vehiculo.trim().length < 2) {
    errores.vehiculo = 'Escribe la marca y el modelo.';
  }
  if (datos.anio) {
    const anio = Number(datos.anio);
    const maximo = Number(hoy.slice(0, 4)) + 1;
    if (!Number.isInteger(anio) || anio < 1950 || anio > maximo) {
      errores.anio = `Escribe un año entre 1950 y ${maximo}.`;
    }
  }
  if (!datos.servicio) {
    errores.servicio = 'Elige un servicio.';
  }
  const fecha = partesFecha(datos.fecha);
  if (!fecha) {
    errores.fecha = 'Elige el día que prefieres.';
  } else if (datos.fecha < hoy) {
    errores.fecha = 'Elige hoy o un día futuro.';
  } else if (!horario[fecha.diaSemana]) {
    errores.fecha = `El ${DIAS[fecha.diaSemana]} el taller está cerrado. Elige otro día.`;
  }
  return { valido: Object.keys(errores).length === 0, errores };
}

/** Texto que llega al WhatsApp del taller. */
export function mensajeReserva(datos) {
  const vehiculo = [datos.vehiculo?.trim(), datos.anio?.toString().trim()].filter(Boolean).join(' ');
  const lineas = [
    'Hola Auto Empire, quiero reservar una cita.',
    '',
    `Servicio: ${datos.servicio}`,
    `Vehículo: ${vehiculo}`,
    `Día: ${fechaLegible(datos.fecha)}`,
  ];
  if (datos.turno) lineas.push(`Horario: ${datos.turno === 'tarde' ? 'en la tarde' : 'en la mañana'}`);
  lineas.push(`Nombre: ${datos.nombre.trim()}`);
  lineas.push(`Teléfono: ${normalizarTelefono(datos.telefono)}`);
  if (datos.comentario && datos.comentario.trim()) {
    lineas.push(`Comentario: ${datos.comentario.trim()}`);
  }
  lineas.push('', '(Enviado desde la página web)');
  return lineas.join('\n');
}

/** Calcula cuándo toca el próximo cambio de aceite. */
export function proximoCambioAceite({ kmUltimo, kmActual, tipo = 'sintetico' } = {}) {
  const ultimo = Number(kmUltimo);
  const actual = Number(kmActual);
  const intervalo = INTERVALOS_ACEITE[tipo];
  if (!intervalo || !Number.isFinite(ultimo) || !Number.isFinite(actual) || ultimo < 0 || actual < 0) {
    return null;
  }
  if (actual < ultimo) return { error: 'El kilometraje actual no puede ser menor que el del último cambio.' };
  const kmProximo = ultimo + intervalo;
  const kmRestantes = kmProximo - actual;
  let estado = 'al-dia';
  if (kmRestantes <= 0) estado = 'vencido';
  else if (kmRestantes <= 1000) estado = 'pronto';
  return { intervalo, kmProximo, kmRestantes, estado };
}

/** "17:00" → "5:00 p.m." */
export function horaLegible(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h < 12 ? 'a.m.' : 'p.m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

function minutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Dice si el taller está abierto en este momento (hora de Panamá). */
export function estadoHorario(ahora = new Date(), horario = TALLER.horario) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: TALLER.zonaHoraria, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(ahora);
  const get = (t) => partes.find((p) => p.type === t).value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const ahoraMin = Number(get('hour')) * 60 + Number(get('minute'));

  const hoy = horario[dia];
  if (hoy && ahoraMin >= minutos(hoy[0]) && ahoraMin < minutos(hoy[1])) {
    return { abierto: true, texto: `Abierto ahora. Cierra a las ${horaLegible(hoy[1])}` };
  }
  if (hoy && ahoraMin < minutos(hoy[0])) {
    return { abierto: false, texto: `Cerrado. Abre hoy a las ${horaLegible(hoy[0])}` };
  }
  for (let i = 1; i <= 7; i += 1) {
    const siguiente = (dia + i) % 7;
    if (horario[siguiente]) {
      const cuando = i === 1 ? 'mañana' : `el ${DIAS[siguiente]}`;
      return { abierto: false, texto: `Cerrado. Abre ${cuando} a las ${horaLegible(horario[siguiente][0])}` };
    }
  }
  return { abierto: false, texto: 'Cerrado.' };
}
