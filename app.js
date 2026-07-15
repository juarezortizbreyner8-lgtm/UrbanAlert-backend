// ===================================================
// URBANALERT
// APP.JS
// ===================================================

document.addEventListener("DOMContentLoaded", () => {

    // ===========================================
    // ELEMENTOS DEL FORMULARIO
    // ===========================================

    const tipoIncidencia = document.getElementById("tipoIncidencia");
    const ubicacion = document.getElementById("ubicacion");
    const descripcion = document.getElementById("descripcion");
    const enviarReporteBtn = document.getElementById("enviarReporteBtn");

    // ===========================================
    // PANEL IA
    // ===========================================

    const prioridadVal = document.getElementById("prioridadVal");
    const entidadVal = document.getElementById("entidadVal");
    const estadoVal = document.getElementById("estadoVal");

    // ===========================================
    // REPORTES
    // ===========================================

    const reportList = document.getElementById("reportList");

        // ===========================================
    // CLASIFICACIÓN AUTOMÁTICA
    // ===========================================

    function clasificarIncidencia(categoria){

        let prioridad = "Baja";
        let entidad = "Municipalidad Provincial de Piura";

        switch(categoria){

            case "Inseguridad o acto delictivo":
                prioridad = "Alta";
                entidad = "Policía Nacional del Perú";
                break;

            case "Incendio o amago de incendio":
                prioridad = "Alta";
                entidad = "Bomberos Voluntarios";
                break;

            case "Cableado eléctrico caído o peligroso":
                prioridad = "Media";
                entidad = "Municipalidad Provincial de Piura";
                break;

            case "Calles o pistas en mal estado":
                prioridad = "Media";
                entidad = "Municipalidad Provincial de Piura";
                break;

            case "Buzón sin tapa":
                prioridad = "Media";
                entidad = "Municipalidad Provincial de Piura";
                break;

            case "Acumulación de basura o desechos":
                prioridad = "Baja";
                entidad = "Municipalidad Provincial de Piura";
                break;

            case "Falta de alumbrado público":
                prioridad = "Media";
                entidad = "Municipalidad Provincial de Piura";
                break;

            case "Falta de servicios básicos (Agua o Luz)":
                prioridad = "Alta";
                entidad = "Municipalidad Provincial de Piura";
                break;

        }

        prioridadVal.textContent = prioridad;
        entidadVal.textContent = entidad;
        estadoVal.textContent = "Clasificado";

        return{
            prioridad,
            entidad
        };

    }

        tipoIncidencia.addEventListener("change", () => {

        clasificarIncidencia(tipoIncidencia.value);

    });

        // ===========================================
    // ENVIAR REPORTE AL SERVIDOR
    // ===========================================

    enviarReporteBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        // Validar campos
        if (
            tipoIncidencia.value === "" ||
            ubicacion.value.trim() === "" ||
            descripcion.value.trim() === ""
        ) {
            alert("Complete todos los campos.");
            return;
        }

        // Mostrar clasificación en pantalla
        const clasificacion = clasificarIncidencia(tipoIncidencia.value);

        // Datos que espera server.js
        const reporte = {

            titulo: tipoIncidencia.value,
            descripcion: descripcion.value,
            categoria: tipoIncidencia.value,
            ubicacion: ubicacion.value

        };

        try {

           const respuesta = await fetch(
    "https://urbanalert-backend-production.up.railway.app/incidencias",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reporte)
    }
);

const datos = await respuesta.json();

if (!respuesta.ok) {
    alert(datos.mensaje || "Error al guardar el reporte.");
    return;
}
      alert(datos.mensaje);

guardarReporteLocal(reporte, clasificacion);
mostrarReportes();
actualizarEstadisticas();
limpiarFormulario();


        } catch (error) {

            console.error(error);

            alert("No se pudo conectar con el servidor.");

        }

    });

        // ===========================================
    // GUARDAR REPORTE EN LOCALSTORAGE
    // ===========================================

    function guardarReporteLocal(reporte, clasificacion){

        let reportes = JSON.parse(localStorage.getItem("reportes")) || [];

        reportes.push({

            titulo: reporte.titulo,
            descripcion: reporte.descripcion,
            categoria: reporte.categoria,
            ubicacion: reporte.ubicacion,
            prioridad: clasificacion.prioridad,
            entidad: clasificacion.entidad,
            estado: "Pendiente"

        });

        localStorage.setItem("reportes", JSON.stringify(reportes));

    }

    // ===========================================
    // MOSTRAR REPORTES
    // ===========================================

    function mostrarReportes(){

        let reportes = JSON.parse(localStorage.getItem("reportes")) || [];

        reportList.innerHTML = "";

        if(reportes.length===0){

            reportList.innerHTML=`
                <div class="empty-reports">
                    <i class="fas fa-inbox"></i>
                    <p>No has enviado reportes aún.</p>
                </div>
            `;

            return;

        }

        reportes.forEach((r,index)=>{

            reportList.innerHTML+=`

            <div class="report-card">

                <h3>Reporte ${index+1}</h3>

                <p><b>Categoría:</b> ${r.categoria}</p>

                <p><b>Ubicación:</b> ${r.ubicacion}</p>

                <p><b>Prioridad:</b> ${r.prioridad}</p>

                <p><b>Entidad:</b> ${r.entidad}</p>

                <p><b>Estado:</b> ${r.estado}</p>

            </div>

            `;

        });

    }

    // ===========================================
    // ESTADÍSTICAS
    // ===========================================

    function actualizarEstadisticas(){

        let reportes = JSON.parse(localStorage.getItem("reportes")) || [];

        document.getElementById("totalReportes").textContent = reportes.length;

        document.getElementById("enProceso").textContent =
            reportes.filter(r=>r.estado==="Pendiente").length;

        document.getElementById("resueltos").textContent =
            reportes.filter(r=>r.estado==="Resuelto").length;

    }

    // ===========================================
    // LIMPIAR FORMULARIO
    // ===========================================

    function limpiarFormulario(){

        tipoIncidencia.value="";
        ubicacion.value="";
        descripcion.value="";

        prioridadVal.textContent="-";
        entidadVal.textContent="-";
        estadoVal.textContent="Esperando";

    }

    // ===========================================
    // INICIAR APLICACIÓN
    // ===========================================

    mostrarReportes();

    actualizarEstadisticas();

});