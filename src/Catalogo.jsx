import { useEffect, useState } from "react";

export default function Catalogo() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  // Array de imágenes del catálogo
  const imagenes = [
    { id: 1, src: "/img/metro.webp", nombre: "metro exodus" },
    { id: 2, src: "/img/Silksong.webp", nombre: "Silksong" },
    { id: 3, src: "/img/dk.webp", nombre: "Dark Souls" },
    { id: 4, src: "/img/d2.webp", nombre: "Destiny 2" },
    { id: 5, src: "/img/gears.webp", nombre: "Gears of war" },
  
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Juegos</h1>
        <div style={{ 
          padding: "5px 10px", 
          borderRadius: "4px", 
          backgroundColor: isOnline ? "#4caf50" : "#f44336",
          color: "white",
          fontSize: "14px"
        }}>
          
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {imagenes.map((imagen) => (
          <div
            key={imagen.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={imagen.src}
              alt={imagen.nombre}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: "10px" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                {imagen.nombre}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
