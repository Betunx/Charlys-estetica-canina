# Configuración de Google Sheets para Citas - Charly's Estética Canina

Este documento explica cómo configurar Google Sheets como backend para el sistema de citas de la página web.

## Paso 1: Crear Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Citas Charly's Estética Canina"
4. La hoja se creará automáticamente con el nombre "Citas" cuando ejecutes el script por primera vez

## Paso 2: Configurar Apps Script

1. En tu Google Sheet, ve al menú **Extensiones > Apps Script**
2. Se abrirá el editor de Google Apps Script
3. Borra el código predeterminado que aparece
4. Copia todo el contenido del archivo `citas-api.gs` y pégalo en el editor
5. Guarda el proyecto (Ctrl+S o Cmd+S)
6. Dale un nombre al proyecto: "API Citas Charlys"

## Paso 3: Implementar como Aplicación Web

1. En el editor de Apps Script, haz clic en el botón **Implementar** (arriba a la derecha)
2. Selecciona **Nueva implementación**
3. Haz clic en el ícono de engranaje junto a "Seleccionar tipo"
4. Selecciona **Aplicación web**
5. Configura los siguientes parámetros:
   - **Descripción**: "API de citas Charly's"
   - **Ejecutar como**: Yo (tu email)
   - **Quién tiene acceso**: Cualquier persona

6. Haz clic en **Implementar**
7. Se te pedirá autorización:
   - Haz clic en **Autorizar acceso**
   - Selecciona tu cuenta de Google
   - Si aparece una advertencia de "Google hasn't verified this app", haz clic en **Avanzado** > **Ir a [nombre del proyecto] (no seguro)**
   - Haz clic en **Permitir**

8. **¡IMPORTANTE!** Copia la **URL de la aplicación web** que aparece. Se verá algo así:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```

## Paso 4: Configurar la URL en tu Aplicación Angular

1. Abre el archivo `src/app/services/citas.service.ts`
2. Busca la línea 30 donde dice:
   ```typescript
   private readonly APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. Reemplaza toda la URL por la que copiaste en el paso anterior
4. Guarda el archivo

## Paso 5: Probar la Integración

1. Ejecuta tu aplicación Angular:
   ```bash
   npm start
   ```
2. Ve a la sección de "Agendar Cita" en tu navegador
3. Intenta crear una cita de prueba
4. Verifica que aparezca en tu Google Sheet

## Estructura de la Hoja

El script creará automáticamente una hoja con los siguientes encabezados:

| Fecha | Hora | Nombre Cliente | Teléfono | Email | Nombre Mascota | Servicio | Estado | Notas | Fecha Creación |
|-------|------|----------------|----------|-------|----------------|----------|--------|-------|----------------|

### Descripción de las columnas:

- **Fecha**: Fecha de la cita (YYYY-MM-DD)
- **Hora**: Hora de la cita (ej: "9:00 AM")
- **Nombre Cliente**: Nombre completo del cliente
- **Teléfono**: Número de teléfono (10 dígitos)
- **Email**: Email del cliente (opcional)
- **Nombre Mascota**: Nombre de la mascota
- **Servicio**: Servicio solicitado (Baño y corte, Corte de pelo, etc.)
- **Estado**: Estado de la cita (Pendiente, Confirmada, Completada, Cancelada)
- **Notas**: Notas adicionales del cliente
- **Fecha Creación**: Timestamp de cuándo se creó la cita

## Gestión de Citas desde Google Sheets

### Cambiar el estado de una cita

Puedes cambiar manualmente el estado de cualquier cita en la columna "Estado". Los valores permitidos son:
- **Pendiente**: Cita recién creada, esperando confirmación
- **Confirmada**: Cita confirmada con el cliente
- **Completada**: Cita realizada
- **Cancelada**: Cita cancelada

### Agregar citas manualmente

Puedes agregar citas directamente en el Google Sheet (por ejemplo, cuando un cliente llama por teléfono):

1. Agrega una nueva fila
2. Completa todos los campos requeridos (Fecha, Hora, Nombre Cliente, Teléfono, Nombre Mascota, Servicio, Estado)
3. Los campos opcionales son: Email, Notas
4. La Fecha Creación se puede dejar vacía

**⚠️ IMPORTANTE**: Asegúrate de que la fecha esté en formato YYYY-MM-DD (ej: 2025-10-15)

### Ver disponibilidad

El calendario de la página web se actualiza automáticamente basándose en las citas del Google Sheet:
- **Verde (Disponible)**: Menos de 8 citas ese día
- **Azul (Medio lleno)**: Entre 8 y 12 citas
- **Gris (Lleno)**: 13 o más citas
- **Beige (Cerrado)**: Domingos y días pasados

## Funciones Opcionales

### Notificaciones por Email

Si quieres recibir un email cada vez que alguien agenda una cita desde la web:

1. Abre el archivo `citas-api.gs` en el editor de Apps Script
2. Ve al final del archivo
3. Descomenta la función `enviarNotificacion` (quita los `/*` y `*/`)
4. Cambia `tu-email@ejemplo.com` por tu email real
5. Descomenta la línea en `doPost` que dice `// enviarNotificacion(datos);`
6. Guarda y crea una nueva implementación (Implementar > Gestionar implementaciones > Editar > Versión: Nueva versión > Implementar)

### Ver Estadísticas

Para ver estadísticas de tus citas:

1. En el editor de Apps Script, selecciona la función `obtenerEstadisticas` en el menú desplegable
2. Haz clic en el botón "Ejecutar"
3. Ve a **Ver > Registros** para ver las estadísticas

## Solución de Problemas

### La cita no aparece en el Google Sheet

- Verifica que la URL del Apps Script esté correctamente configurada en `citas.service.ts`
- Revisa la consola del navegador (F12) para ver si hay errores
- Verifica que el Apps Script esté implementado con acceso "Cualquier persona"

### Error de CORS

Si ves errores de CORS en la consola:
- Asegúrate de que el Apps Script esté correctamente implementado como "Aplicación web"
- Verifica que "Quién tiene acceso" esté configurado como "Cualquier persona"

### La disponibilidad no se actualiza

- Presiona F5 en tu navegador para recargar la página
- Verifica que las fechas en el Google Sheet estén en formato YYYY-MM-DD
- Verifica que las citas canceladas tengan exactamente el estado "Cancelada"

### Necesito cambiar la configuración

Si necesitas hacer cambios en el Apps Script:
1. Edita el código en el editor
2. Guarda los cambios
3. Ve a **Implementar > Gestionar implementaciones**
4. Haz clic en el ícono de lápiz (editar)
5. Cambia "Versión" a "Nueva versión"
6. Haz clic en **Implementar**
7. La URL seguirá siendo la misma, no necesitas cambiarla en tu aplicación

## Seguridad

- Las citas son visibles solo para ti y las personas con las que compartas el Google Sheet
- El Apps Script se ejecuta con tus permisos
- Nunca compartas la URL de implementación públicamente (aunque está en el código fuente del frontend, es segura porque solo permite las operaciones GET y POST definidas)
- Puedes revocar el acceso en cualquier momento desde Google Apps Script

## Respaldo

Google Sheets guarda automáticamente el historial de versiones. Para restaurar una versión anterior:
1. Ve a **Archivo > Historial de versiones > Ver historial de versiones**
2. Selecciona la versión que quieres restaurar
3. Haz clic en **Restaurar esta versión**

## Contacto

Si tienes problemas con la configuración, consulta:
- [Documentación de Google Apps Script](https://developers.google.com/apps-script)
- [Guía de Web Apps](https://developers.google.com/apps-script/guides/web)
