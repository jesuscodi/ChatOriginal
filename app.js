// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp, query, orderByChild } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Tu configuración de Firebase (rellena con la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyCgHojFMtxO0_FbONRMYdfCt8gxFpJMZxg",
  authDomain: "chatweb-7d65a.firebaseapp.com",
  databaseURL: "https://chatweb-7d65a-default-rtdb.firebaseio.com",
  projectId: "chatweb-7d65a",
  storageBucket: "chatweb-7d65a.firebasestorage.app",
  messagingSenderId: "741436207771",
  appId: "1:741436207771:web:707ee44969271b25fb4c3e",
  measurementId: "G-7L7N83H41N"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencia de mensajes
const messagesRef = ref(db, "mensajes");

// Elementos del DOM
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("sendBtn");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");

// Enviar mensaje
sendBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();

    if (!username || !message) return alert("Escribe tu nombre y mensaje");

    push(messagesRef, {
        usuario: username,
        texto: message,
        fecha: Date.now()
    });

    messageInput.value = "";
});

// Escuchar mensajes nuevos
const mensajesOrdenados = query(messagesRef, orderByChild("fecha"));

onChildAdded(mensajesOrdenados, (snapshot) => {
    const data = snapshot.val();
    const fecha = new Date(data.fecha);
    const hora = fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<strong>${data.usuario}</strong>: ${data.texto} <br><small>${hora}</small>`;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll
});
