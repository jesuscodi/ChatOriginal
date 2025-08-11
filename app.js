import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, set, update, serverTimestamp, onDisconnect } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://TU_PROJECT_ID.firebaseio.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let username = "";
const loginSection = document.getElementById("loginSection");
const chatSection = document.getElementById("chatSection");
const startChatBtn = document.getElementById("startChatBtn");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");

const usuariosActivosRef = ref(db, "usuariosActivos");

function registrarUsuarioActivo() {
    const userRef = ref(db, `usuariosActivos/${username}`);
    set(userRef, {
        conectado: true,
        ultimaActividad: serverTimestamp()
    });
    onDisconnect(userRef).remove();
}

function escucharUsuariosActivos() {
    onValue(usuariosActivosRef, (snapshot) => {
        const data = snapshot.val() || {};
        const listaUsuarios = Object.keys(data);
        mostrarUsuariosActivos(listaUsuarios);
    });
}

function mostrarUsuariosActivos(lista) {
    let listaHTML = "<strong>Usuarios en línea:</strong> " + lista.join(", ");
    document.getElementById("usuariosOnline").innerHTML = listaHTML;
}

function enviarMensaje() {
    const texto = messageInput.value.trim();
    if (texto !== "") {
        push(ref(db, "mensajes"), {
            usuario: username,
            texto: texto,
            timestamp: serverTimestamp(),
            vistoPor: [username]
        });
        messageInput.value = "";
    }
}

function escucharMensajes() {
    onValue(ref(db, "mensajes"), (snapshot) => {
        const data = snapshot.val();
        messagesDiv.innerHTML = "";
        for (let id in data) {
            const mensaje = data[id];
            const visto = mensaje.vistoPor ? " ✅" : "";
            messagesDiv.innerHTML += `<p><strong>${mensaje.usuario}:</strong> ${mensaje.texto}${visto}</p>`;
            if (!mensaje.vistoPor || !mensaje.vistoPor.includes(username)) {
                update(ref(db, `mensajes/${id}`), {
                    vistoPor: mensaje.vistoPor ? [...mensaje.vistoPor, username] : [username]
                });
            }
        }
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

startChatBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("username");
    if (nameInput.value.trim() !== "") {
        username = nameInput.value.trim();
        localStorage.setItem("chatUsername", username);
        loginSection.style.display = "none";
        chatSection.style.display = "block";
        registrarUsuarioActivo();
        escucharUsuariosActivos();
        escucharMensajes();
    }
});

sendBtn.addEventListener("click", enviarMensaje);

window.addEventListener("load", () => {
    const savedName = localStorage.getItem("chatUsername");
    if (savedName) {
        username = savedName;
        loginSection.style.display = "none";
        chatSection.style.display = "block";
        registrarUsuarioActivo();
        escucharUsuariosActivos();
        escucharMensajes();
    }
});
