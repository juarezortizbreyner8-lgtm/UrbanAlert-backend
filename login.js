document.getElementById("loginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    try {

        fetch("https://urbanalert-backend-production.up.railway.app/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                correo,
                password
            })

        });

        const datos = await respuesta.json();

        if (datos.acceso) {

            if (datos.usuario.rol === "administrador") {

                window.location.href = "admin.html";

            } else if (datos.usuario.rol === "entidad") {

                localStorage.setItem("entidad", JSON.stringify(datos.usuario));

                window.location.href = "entidad.html";

            }

        } else {

            alert("Correo o contraseña incorrectos.");

        }

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

});