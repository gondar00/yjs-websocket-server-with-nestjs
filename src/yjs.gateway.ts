/* eslint-disable @typescript-eslint/no-empty-function */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import { getCookie } from './utils';

@WebSocketGateway({ path: '/yjs' })
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: Request): void {
    // We can handle authentication of user like below

    // const token = getCookie(request?.headers?.cookie, 'auth_token');
    // const ERROR_CODE_WEBSOCKET_AUTH_FAILED = 4000;
    // if (!token) {
    //   connection.close(ERROR_CODE_WEBSOCKET_AUTH_FAILED);
    // } else {
    //   const signedJwt = this.authService.verifyToken(token);
    //   if (!signedJwt) connection.close(ERROR_CODE_WEBSOCKET_AUTH_FAILED);
    //   else {
    //     const docName = getCookie(request?.headers?.cookie, 'roomName');
    //     setupWSConnection(connection, request, { ...(docName && { docName }) });
    //   }
    // }

    const docName = getCookie(request?.headers?.cookie, 'roomName');
    setupWSConnection(connection, request, { ...(docName && { docName }) });
  }

  handleDisconnect(): void {}
}
