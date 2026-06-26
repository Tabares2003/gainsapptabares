// Importamos la función para inicializar la aplicación de Firebase
import { initializeApp } from "firebase/app";

// Añade aquí tus credenciales
const firebaseConfig = {
  apiKey: "AIzaSyCwSd_psPOCB2AQN4mcHkKRn8engrv0tFs",
  authDomain: "gananciasapp-11bab.firebaseapp.com",
  projectId: "gananciasapp-11bab",
  storageBucket: "gananciasapp-11bab.firebasestorage.app",
  messagingSenderId: "2534201457",
  appId: "1:2534201457:web:971971657d78d957cbe3d0"
};

// Inicializamos la aplicación y la guardamos en firebasevApp
const firebaseApp = initializeApp(firebaseConfig);
// Exportamos firebaseApp para poder utilizarla en cualquier lugar de la aplicación
export default firebaseApp;
