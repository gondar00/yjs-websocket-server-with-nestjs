import Room from "components/Room";
import React from "react";
import { awareness } from "y";
import { PresenceProvider } from "y-presence";
import "./styles.css";

export default function App() {
  // React.useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:5001');
  //   socket.addEventListener('open', (event) => {
  //     console.log('connection established', event);
  //   });

  //   socket.addEventListener('close', (event) => {
  //     console.log('connection closed', event);
  //   });

  //   socket.addEventListener('error', (event) => {
  //     console.log('WebSocket error: ', event);
  //   });
  // }, [])
  return (
    <div className="App">
      <PresenceProvider awareness={awareness}>
        <Room />
      </PresenceProvider>
    </div>
  )
}