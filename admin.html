document.getElementById("loginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    try {

        const respuesta = await fetch("http://localhost:3000/login", {

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