import React, { useEffect } from "react";
import Cookies from 'js-cookie'

import Room from "components/Room";
import { awareness } from "y";
import { PresenceProvider } from "y-presence";
import "./styles.css";

export default function App() {
  useEffect(() => {
    Cookies.set('roomName', 'roomName')
  }, []);

  return (
    <div className="App">
      <PresenceProvider awareness={awareness}>
        <Room />
      </PresenceProvider>
    </div>
  )
}