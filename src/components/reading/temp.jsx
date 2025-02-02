import React, { useEffect, useState } from "react";

function TemperatureDisplay() {
  const [temperatureData, setTemperatureData] = useState(null);

  useEffect(() => {
    let ws;
    const connectWebSocket = () => {
      ws = new WebSocket("ws://localhost:6789");
  
      ws.onopen = () => {
        console.log("Connected to WebSocket server");
      };
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTemperatureData(data);
      };
  
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      ws.onclose = () => {
        console.log("WebSocket connection closed, attempting to reconnect in 2 seconds...");
        setTimeout(connectWebSocket, 2000);
      };
    };
  
    connectWebSocket();
  
    // Clean up on component unmount
    return () => {
      if (ws) ws.close();
    };
  }, []);
  

  return (
    <div>
      <h2>Temperature Data</h2>
      {temperatureData ? (
        <div>
          <p>
            Temperature: {temperatureData.temperature}
            {temperatureData.unit}
          </p>
          {temperatureData.timestamp && <p>Timestamp: {temperatureData.timestamp}</p>}
          {temperatureData.type && <p>Type: {temperatureData.type}</p>}
        </div>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}

export default TemperatureDisplay;
