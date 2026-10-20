// Conecta la lógica con la página.
import {
  estadoHorario,
  hoyEnPanama,
  mensajeReserva,
  proximoCambioAceite,
  urlWhatsApp,
  validarReserva,
} from './logica.js';

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

// Enlaces de WhatsApp con mensaje prellenado
$$('[data-whatsapp]').forEach((a) => {
  a.href = urlWhatsApp(a.dataset.whatsapp);
});

// Abierto / cerrado según la hora de Panamá
function pintarHorario() {
  const estado = estadoHorario();
  const texto = $('[data-estado-horario]');
  const punto = $('[data-estado-punto]');
  if (texto) texto.textContent = estado.texto;
  if (punto) punto.dataset.abierto = String(estado.abierto);
}
pintarHorario();
setInterval(pintarHorario, 60_000);

// Año del pie
const anio = $('[data-anio]');
if (anio) anio.textContent = hoyEnPanama().slice(0, 4);

// Orden de servicio
const form = $('#orden');
const hoy = hoyEnPanama();
const [a, m, d] = hoy.split('-');
$('[data-fecha-hoy]').textContent = `${d}/${m}/${a}`;
form.fecha.min = hoy;

function elegirServicio(servicio) {
  const opcion = [...form.servicio.options].find((o) => o.value === servicio || o.text === servicio);
  if (opcion) form.servicio.value = opcion.value || opcion.text;
  limpiarError('servicio');
}

$$('[data-servicio]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    elegirServicio(el.dataset.servicio);
    $('#reservar').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    form.nombre.focus({ preventScroll: true });
  });
});

function limpiarError(campo) {
  const input = form.elements[campo];
  const error = $(`#error-${campo}`);
  if (input) input.removeAttribute('aria-invalid');
  if (input) input.removeAttribute('aria-describedby');
  if (error) error.textContent = '';
}

function mostrarErrores(errores) {
  ['nombre', 'telefono', 'vehiculo', 'anio', 'servicio', 'fecha'].forEach(limpiarError);
  Object.entries(errores).forEach(([campo, mensaje]) => {
    const input = form.elements[campo];
    const error = $(`#error-${campo}`);
    if (error) error.textContent = mensaje;
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', `error-${campo}`);
    }
  });
}

form.addEventListener('input', (e) => {
  if (e.target.name && e.target.getAttribute('aria-invalid')) limpiarError(e.target.name);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  const { valido, errores } = validarReserva(datos, hoyEnPanama());
  mostrarErrores(errores);
  const resultado = $('[data-resultado]');
  const sello = $('[data-sello]');

  if (!valido) {
    resultado.textContent = '';
    sello.classList.remove('visible');
    form.elements[Object.keys(errores)[0]]?.focus();
    return;
  }

  const url = urlWhatsApp(mensajeReserva(datos));
  sello.classList.remove('visible');
  void sello.offsetWidth; // reinicia la animación si se envía otra vez
  sello.classList.add('visible');
  resultado.innerHTML = '';
  resultado.append('Listo. Abrimos WhatsApp con tu orden; solo dale enviar. ');
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.target = '_blank';
  enlace.rel = 'noopener';
  enlace.textContent = 'Si no se abrió, toca aquí.';
  resultado.append(enlace);
  window.open(url, '_blank', 'noopener');
});

// Calculadora de cambio de aceite
const calc = {
  ultimo: $('#km-ultimo'),
  actual: $('#km-actual'),
  tipo: $('#tipo-aceite'),
  salida: $('[data-calculadora]'),
  boton: $('[data-calculadora-boton]'),
};
const soloNumero = (v) => v.replace(/[^\d]/g, '');
const km = (n) => `${Math.abs(n).toLocaleString('en-US')} km`;

function calcular() {
  const ultimo = soloNumero(calc.ultimo.value);
  const actual = soloNumero(calc.actual.value);
  calc.boton.hidden = true;
  calc.salida.removeAttribute('data-estado');
  if (!ultimo || !actual) {
    calc.salida.textContent = 'Escribe tus kilómetros y te decimos cuánto te falta.';
    return;
  }
  const r = proximoCambioAceite({ kmUltimo: ultimo, kmActual: actual, tipo: calc.tipo.value });
  if (!r) return;
  if (r.error) {
    calc.salida.textContent = r.error;
    return;
  }
  calc.salida.dataset.estado = r.estado;
  const proximo = `Te toca a los ${r.kmProximo.toLocaleString('en-US')} km.`;
  if (r.estado === 'vencido') {
    calc.salida.innerHTML = `<strong>Te pasaste por ${km(r.kmRestantes)}</strong>${proximo} Conviene hacerlo esta semana.`;
  } else {
    calc.salida.innerHTML = `<strong>Te faltan ${km(r.kmRestantes)}</strong>${proximo}`;
  }
  calc.boton.hidden = r.estado === 'al-dia';
}
[calc.ultimo, calc.actual, calc.tipo].forEach((el) => el.addEventListener('input', calcular));

// El botón flotante se oculta mientras la orden está en pantalla para no tapar los campos
const flotante = $('.flotante');
if (flotante && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entrada]) => {
    flotante.classList.toggle('oculto', entrada.isIntersecting);
  }, { threshold: 0.15 }).observe($('#reservar'));
}
