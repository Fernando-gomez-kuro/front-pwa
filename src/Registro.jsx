import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { API_URL } from "./config/api"; // <-- ya no usamos esto
import { saveRegistroPendiente, eliminarRegistroSincronizado } from "./utils/indexedDB";
import { sincronizarRegistrosPendientes } from "./utils/syncService";

// PON TU LINK DE RENDER AQUÍ
const API_URL = "https://backend-pwa-ofj5.onrender.com";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registrar = async () => {
    if (!nombre.trim() || !telefono.trim() || !password.trim()) {
      alert(" completa todos los campos");
      return;
    }

    const datosRegistro = { nombre, telefono, password };
    let registroIdEnIndexedDB = null;

    try {
      registroIdEnIndexedDB = await saveRegistroPendiente(datosRegistro);
      console.log("✅ Registro guardado en IndexedDB con ID:", registroIdEnIndexedDB);
    } catch (err) {
      console.error("❌ Error al guardar en IndexedDB:", err);
      alert("Error al guardar el registro localmente");
      return;
    }

    if (navigator.onLine) {
      try {
        console.log("guardando en el servidor...");
        const res = await fetch(`${API_URL}/api/usuarios/registrar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosRegistro)
        });

        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        if (res.ok) {
          if (registroIdEnIndexedDB) {
            try {
              await eliminarRegistroSincronizado(registroIdEnIndexedDB);
              console.log("✅ Registro eliminado de IndexedDB (ya está en servidor)");
            } catch (err) {
              console.error("⚠️ Error al eliminar de IndexedDB:", err);
            }
          }
          
          console.log("Sincronizando otros registros pendientes...");
          const syncResult = await sincronizarRegistrosPendientes();
          console.log("📊 Resultado de sincronización:", syncResult);
          
          alert("ahora tengo tus datos muajajajajaja");
          navigate("/");
        } else {
          console.error("Error del servidor:", data.error);
          alert(data.error || "Error al registrarse. El registro se guardó localmente y se sincronizará cuando haya conexión.");
          setNombre("");
          setTelefono("");
          setPassword("");
        }
      } catch (err) {
        console.error("Error de conexión:", err);
        alert("Error de conexión. El registro se guardó localmente y se sincronizará automáticamente cuando haya internet.");
        setNombre("");
        setTelefono("");
        setPassword("");
      }
    } else {
      console.log("Sin conexión, guardado solo en IndexedDB");
      alert("no tienes conexion a internet, pero no te preocupes, cuando regrese, tus datos se agregaran a nuestro servidor y podras seguir tu camino");
      setNombre("");
      setTelefono("");
      setPassword("");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      
     

      <input
        type="text"
        placeholder="Correo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ padding: "8px", margin: "5px 0", width: "300px" }}
      /><br/>

      <input
        type="text"
        placeholder="usuario"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        style={{ padding: "8px", margin: "5px 0", width: "300px" }}
      /><br/>

      <input
        type="text"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px", margin: "5px 0", width: "300px" }}
      /><br/>

      <button 
        onClick={registrar}
        style={{ 
          padding: "10px 20px", 
          marginTop: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Registrar
      </button>
    </div>
  );
}

export default Registro;
