import { describe, expect, it } from 'vitest';
import {
  TALLER,
  estadoHorario,
  fechaLegible,
  horaLegible,
  hoyEnPanama,
  mensajeReserva,
  normalizarTelefono,
  proximoCambioAceite,
  urlWhatsApp,
  validarReserva,
} from '../public/js/logica.js';

const reservaValida = {
  nombre: 'Juan Pérez',
  telefono: '6000 1234',
  vehiculo: 'Toyota Hilux',
  anio: '2019',
  servicio: 'Cambio de aceite y filtro',
  fecha: '2026-10-24',
  turno: 'manana',
  comentario: 'Hace un ruido al frenar',
};
const HOY = '2026-10-19'; // lunes

describe('urlWhatsApp', () => {
  it('usa el número del taller y codifica el texto', () => {
    expect(urlWhatsApp('Hola, ¿tienen cita?')).toBe(
      'https://wa.me/50762589348?text=Hola%2C%20%C2%BFtienen%20cita%3F',
    );
  });
  it('sin texto devuelve el enlace directo', () => {
    expect(urlWhatsApp()).toBe(`https://wa.me/${TALLER.whatsapp}`);
  });
});

describe('normalizarTelefono', () => {
  it.each([
    ['60001234', '6000-1234'],
    ['6000-1234', '6000-1234'],
    ['+507 6000 1234', '6000-1234'],
    ['2001234', '200-1234'],
  ])('%s → %s', (entrada, salida) => {
    expect(normalizarTelefono(entrada)).toBe(salida);
  });
  it.each(['', '123', '600012345678', 'abc'])('rechaza %s', (entrada) => {
    expect(normalizarTelefono(entrada)).toBeNull();
  });
});

describe('fechaLegible', () => {
  it('escribe el día en español', () => {
    expect(fechaLegible('2026-10-24')).toBe('sábado 24 de octubre');
    expect(fechaLegible('2026-12-01')).toBe('martes 1 de diciembre');
  });
  it('ignora fechas inválidas', () => {
    expect(fechaLegible('2026-02-30')).toBe('');
    expect(fechaLegible('mañana')).toBe('');
  });
});

describe('hoyEnPanama', () => {
  it('usa la hora de Panamá (UTC-5), no la de UTC', () => {
    // 20 de oct 02:00 UTC = 19 de oct 21:00 en Panamá
    expect(hoyEnPanama(new Date('2026-10-20T02:00:00Z'))).toBe('2026-10-19');
  });
});

describe('validarReserva', () => {
  it('acepta una orden completa', () => {
    expect(validarReserva(reservaValida, HOY)).toEqual({ valido: true, errores: {} });
  });
  it('marca los campos obligatorios vacíos', () => {
    const { valido, errores } = validarReserva({}, HOY);
    expect(valido).toBe(false);
    expect(Object.keys(errores).sort()).toEqual(['fecha', 'nombre', 'servicio', 'telefono', 'vehiculo']);
  });
  it('no permite fechas pasadas', () => {
    const { errores } = validarReserva({ ...reservaValida, fecha: '2026-10-18' }, HOY);
    expect(errores.fecha).toBe('Elige hoy o un día futuro.');
  });
  it('permite reservar para hoy', () => {
    expect(validarReserva({ ...reservaValida, fecha: HOY }, HOY).valido).toBe(true);
  });
  it('no permite domingos porque el taller cierra', () => {
    const { errores } = validarReserva({ ...reservaValida, fecha: '2026-10-25' }, HOY);
    expect(errores.fecha).toMatch(/domingo el taller está cerrado/);
  });
  it('valida el año del vehículo si se escribe', () => {
    expect(validarReserva({ ...reservaValida, anio: '1890' }, HOY).errores.anio).toBeDefined();
    expect(validarReserva({ ...reservaValida, anio: '' }, HOY).valido).toBe(true);
  });
});

describe('mensajeReserva', () => {
  it('arma el mensaje que llega al WhatsApp del taller', () => {
    expect(mensajeReserva(reservaValida)).toBe([
      'Hola Auto Empire, quiero reservar una cita.',
      '',
      'Servicio: Cambio de aceite y filtro',
      'Vehículo: Toyota Hilux 2019',
      'Día: sábado 24 de octubre',
      'Horario: en la mañana',
      'Nombre: Juan Pérez',
      'Teléfono: 6000-1234',
      'Comentario: Hace un ruido al frenar',
      '',
      '(Enviado desde la página web)',
    ].join('\n'));
  });
  it('omite comentario y horario si no se dieron', () => {
    const texto = mensajeReserva({ ...reservaValida, comentario: ' ', turno: '' });
    expect(texto).not.toMatch(/Comentario|Horario/);
  });
});

describe('proximoCambioAceite', () => {
  it('calcula los kilómetros que faltan', () => {
    expect(proximoCambioAceite({ kmUltimo: 40000, kmActual: 45000, tipo: 'sintetico' })).toEqual({
      intervalo: 10000, kmProximo: 50000, kmRestantes: 5000, estado: 'al-dia',
    });
  });
  it('avisa cuando falta poco', () => {
    expect(proximoCambioAceite({ kmUltimo: 40000, kmActual: 44200, tipo: 'convencional' }).estado).toBe('pronto');
  });
  it('avisa cuando ya se pasó', () => {
    const r = proximoCambioAceite({ kmUltimo: 40000, kmActual: 48000, tipo: 'semisintetico' });
    expect(r.estado).toBe('vencido');
    expect(r.kmRestantes).toBe(-500);
  });
  it('rechaza un kilometraje actual menor al último', () => {
    expect(proximoCambioAceite({ kmUltimo: 50000, kmActual: 40000 }).error).toBeDefined();
  });
  it('devuelve null con datos incompletos', () => {
    expect(proximoCambioAceite({ kmUltimo: '', kmActual: 'x' })).toBeNull();
  });
});

describe('horario', () => {
  it('formatea horas en 12 h', () => {
    expect(horaLegible('08:00')).toBe('8:00 a.m.');
    expect(horaLegible('12:00')).toBe('12:00 p.m.');
    expect(horaLegible('17:30')).toBe('5:30 p.m.');
  });
  it('abierto un lunes a las 10 a.m. de Panamá', () => {
    expect(estadoHorario(new Date('2026-10-19T15:00:00Z'))).toEqual({
      abierto: true, texto: 'Abierto ahora. Cierra a las 5:00 p.m.',
    });
  });
  it('cerrado un lunes a las 6 a.m., abre hoy', () => {
    expect(estadoHorario(new Date('2026-10-19T11:00:00Z')).texto).toBe('Cerrado. Abre hoy a las 8:00 a.m.');
  });
  it('cerrado un lunes en la noche, abre mañana', () => {
    expect(estadoHorario(new Date('2026-10-20T02:00:00Z')).texto).toBe('Cerrado. Abre mañana a las 8:00 a.m.');
  });
  it('sábado en la tarde, abre el lunes', () => {
    expect(estadoHorario(new Date('2026-10-24T19:00:00Z')).texto).toBe('Cerrado. Abre el lunes a las 8:00 a.m.');
  });
});
