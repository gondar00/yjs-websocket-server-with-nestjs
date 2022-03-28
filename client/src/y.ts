import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

// Create the shared doc
export const doc = new Y.Doc();

// Create a websocket provider
export const provider = new WebsocketProvider('ws://localhost:5001', '', doc);

// Export the provider's awareness API
export const awareness = provider.awareness;
