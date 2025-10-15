/**
 * Google Apps Script para gestión de citas - Charly's Estética Canina
 *
 * INSTRUCCIONES DE CONFIGURACIÓN:
 *
 * 1. Abre tu Google Sheet de citas
 * 2. Ve a Extensiones > Apps Script
 * 3. Copia y pega este código completo
 * 4. Guarda el proyecto (dale un nombre como "API Citas Charlys")
 * 5. Haz clic en "Implementar" > "Nueva implementación"
 * 6. Selecciona tipo: "Aplicación web"
 * 7. Configuración:
 *    - Descripción: "API de citas"
 *    - Ejecutar como: "Yo (tu email)"
 *    - Quién tiene acceso: "Cualquier persona"
 * 8. Haz clic en "Implementar"
 * 9. Copia la URL de implementación
 * 10. Pega esa URL en src/app/services/citas.service.ts en la línea 30
 *
 * ESTRUCTURA DE LA HOJA:
 * La primera fila debe tener estos encabezados exactos (en la hoja llamada "Citas"):
 * | Fecha | Hora | Nombre Cliente | Teléfono | Email | Nombre Mascota | Servicio | Estado | Notas | Fecha Creación |
 */

// Nombre de la hoja donde se guardarán las citas
const NOMBRE_HOJA = 'Citas';

/**
 * Maneja las peticiones GET - Obtener todas las citas
 */
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();

    // Si solo hay encabezados, devolver array vacío
    if (data.length <= 1) {
      return createResponse(true, []);
    }

    // Convertir datos a objetos JSON
    const headers = data[0];
    const citas = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const cita = {
        fecha: formatDate(row[0]),
        hora: row[1],
        nombreCliente: row[2],
        telefono: row[3].toString(),
        emailCliente: row[4],
        nombreMascota: row[5],
        servicio: row[6],
        estado: row[7],
        notas: row[8],
        fechaCreacion: row[9] ? formatDate(row[9]) : ''
      };
      citas.push(cita);
    }

    return createResponse(true, citas);

  } catch (error) {
    return createResponse(false, null, error.toString());
  }
}

/**
 * Maneja las peticiones POST - Crear una nueva cita
 */
function doPost(e) {
  try {
    // Parse del JSON recibido
    const datos = JSON.parse(e.postData.contents);

    // Validar datos requeridos
    if (!datos.fecha || !datos.hora || !datos.nombreCliente ||
        !datos.telefono || !datos.nombreMascota || !datos.servicio) {
      return createResponse(false, null, 'Faltan datos requeridos');
    }

    const sheet = getOrCreateSheet();

    // Verificar si el horario ya está ocupado
    const horaDisponible = verificarDisponibilidad(sheet, datos.fecha, datos.hora);
    if (!horaDisponible) {
      return createResponse(false, null, 'Este horario ya está ocupado. Por favor selecciona otro.');
    }

    // Agregar nueva fila con la cita
    const nuevaFila = [
      datos.fecha,
      datos.hora,
      datos.nombreCliente,
      datos.telefono,
      datos.emailCliente || '',
      datos.nombreMascota,
      datos.servicio,
      datos.estado || 'Pendiente',
      datos.notas || '',
      new Date().toISOString()
    ];

    sheet.appendRow(nuevaFila);

    // Enviar notificación (opcional - descomentar si quieres recibir emails)
    // enviarNotificacion(datos);

    return createResponse(true, {
      mensaje: 'Cita creada exitosamente',
      cita: datos
    });

  } catch (error) {
    return createResponse(false, null, error.toString());
  }
}

/**
 * Obtiene o crea la hoja de citas
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(NOMBRE_HOJA);

  // Si no existe, crear la hoja con encabezados
  if (!sheet) {
    sheet = ss.insertSheet(NOMBRE_HOJA);
    const headers = [
      'Fecha', 'Hora', 'Nombre Cliente', 'Teléfono', 'Email',
      'Nombre Mascota', 'Servicio', 'Estado', 'Notas', 'Fecha Creación'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Formato de encabezados
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#027878')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');

    // Congelar primera fila
    sheet.setFrozenRows(1);

    // Ajustar anchos de columnas
    sheet.setColumnWidth(1, 100); // Fecha
    sheet.setColumnWidth(2, 100); // Hora
    sheet.setColumnWidth(3, 150); // Nombre Cliente
    sheet.setColumnWidth(4, 120); // Teléfono
    sheet.setColumnWidth(5, 180); // Email
    sheet.setColumnWidth(6, 120); // Nombre Mascota
    sheet.setColumnWidth(7, 120); // Servicio
    sheet.setColumnWidth(8, 100); // Estado
    sheet.setColumnWidth(9, 200); // Notas
    sheet.setColumnWidth(10, 150); // Fecha Creación
  }

  return sheet;
}

/**
 * Verifica si un horario está disponible
 */
function verificarDisponibilidad(sheet, fecha, hora) {
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const fechaExistente = formatDate(data[i][0]);
    const horaExistente = data[i][1];
    const estado = data[i][7];

    // Si existe una cita en el mismo horario que no esté cancelada
    if (fechaExistente === fecha && horaExistente === hora && estado !== 'Cancelada') {
      return false;
    }
  }

  return true;
}

/**
 * Formatea una fecha a string YYYY-MM-DD
 */
function formatDate(date) {
  if (!date) return '';

  if (typeof date === 'string') {
    return date;
  }

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Crea una respuesta JSON estandarizada
 */
function createResponse(success, data, error = null) {
  const response = {
    success: success,
    data: data,
    error: error,
    timestamp: new Date().toISOString()
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * OPCIONAL: Envía notificación por email cuando se crea una cita
 * Descomenta esta función y la llamada en doPost si quieres recibir emails
 */
/*
function enviarNotificacion(datos) {
  const destinatario = 'tu-email@ejemplo.com'; // Cambia por tu email
  const asunto = `Nueva Cita - ${datos.nombreMascota}`;
  const mensaje = `
    Se ha registrado una nueva cita:

    📅 Fecha: ${datos.fecha}
    🕐 Hora: ${datos.hora}

    👤 Cliente: ${datos.nombreCliente}
    📱 Teléfono: ${datos.telefono}
    📧 Email: ${datos.emailCliente || 'No proporcionado'}

    🐕 Mascota: ${datos.nombreMascota}
    ✂️ Servicio: ${datos.servicio}

    📝 Notas: ${datos.notas || 'Ninguna'}
  `;

  MailApp.sendEmail(destinatario, asunto, mensaje);
}
*/

/**
 * FUNCIÓN AUXILIAR: Obtener estadísticas de citas (opcional)
 * Puedes llamar esta función manualmente desde el editor de scripts
 */
function obtenerEstadisticas() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();

  let pendientes = 0;
  let confirmadas = 0;
  let completadas = 0;
  let canceladas = 0;

  for (let i = 1; i < data.length; i++) {
    const estado = data[i][7];
    switch(estado) {
      case 'Pendiente': pendientes++; break;
      case 'Confirmada': confirmadas++; break;
      case 'Completada': completadas++; break;
      case 'Cancelada': canceladas++; break;
    }
  }

  Logger.log('=== ESTADÍSTICAS DE CITAS ===');
  Logger.log(`Total: ${data.length - 1}`);
  Logger.log(`Pendientes: ${pendientes}`);
  Logger.log(`Confirmadas: ${confirmadas}`);
  Logger.log(`Completadas: ${completadas}`);
  Logger.log(`Canceladas: ${canceladas}`);
}
