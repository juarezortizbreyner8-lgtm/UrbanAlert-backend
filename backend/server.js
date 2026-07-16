const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();


const conexion = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE

});

conexion.connect((error) => {
    if (error) {
        console.log("❌ Error al conectar con MySQL");
        console.log(error);
    } else {
        console.log("✅ Conectado a MySQL correctamente");
    }
});


app.get("/", (req, res) => {
    res.send("Servidor UrbanAlert funcionando");
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.post("/incidencias", (req, res) => {

    const { titulo, descripcion, categoria, ubicacion } = req.body;

let id_entidad = null;
let prioridad = "Baja";

switch (categoria) {

    case "Inseguridad o acto delictivo":
    id_entidad = 1;          // Policía Nacional del Perú
    prioridad = "Alta";
    break;
    
    case "Incendio o amago de incendio":
        id_entidad = 2;          // Bomberos
        prioridad = "Alta";
        break;

    case "Cableado eléctrico caído o peligroso":
        id_entidad = 3;          // Municipalidad
        prioridad = "Media";
        break;

    case "Buzón sin tapa":
        id_entidad = 3;
        prioridad = "Media";
        break;

    case "Acumulación de basura o desechos":
        id_entidad = 3;
        prioridad = "Baja";
        break;

    case "Calles o pistas en mal estado":
        id_entidad = 3;
        prioridad = "Media";
        break;

    case "Falta de servicios básicos (Agua o Luz)":
        id_entidad = 3;
        prioridad = "Alta";
        break;

    case "Falta de alumbrado público":
        id_entidad = 3;
        prioridad = "Media";
        break;

    default:
        id_entidad = 3;
        prioridad = "Media";
}

    const sql = `
    INSERT INTO incidencias
    (titulo,descripcion,categoria,ubicacion,prioridad,id_entidad)
    VALUES (?,?,?,?,?,?)
`;

    conexion.query(

        sql,

        [

    titulo,
    descripcion,
    categoria,
    ubicacion,
    prioridad,
    id_entidad

],

        (error, resultado) => {

            if(error){

                console.log(error);

                return res.status(500).json({

                    mensaje:"Error al guardar"

                });

            }

            res.json({

                mensaje:"Reporte guardado correctamente"

            });

        }

    );

});

app.post("/login", (req, res) => {

    const { correo, password } = req.body;

    const sql = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
        AND password = ?
    `;

    conexion.query(sql, [correo, password], (error, resultado) => {

        if (error) {

            return res.status(500).json({
                mensaje: "Error del servidor"
            });

        }

        if (resultado.length > 0) {

            res.json({
                acceso: true,
                usuario: resultado[0]
            });

        } else {

            res.json({
                acceso: false
            });

        }

    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});