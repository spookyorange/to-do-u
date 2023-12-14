import { Query } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}

  @WebSocketServer() server: Server;
  users = 0;

  cumulativeUsersAndTheirSockets = {};

  async handleConnection(
    @Query('user_jwt')
    query: {
      handshake: { query: { user_jwt: string } };
      id: string;
    },
  ) {
    console.warn('user_jwt', query.handshake.query.user_jwt);

    const user = await this.authService.getUserFromToken(
      query.handshake.query.user_jwt,
    );

    if (!user) {
      return;
    } else {
      this.cumulativeUsersAndTheirSockets[user.id] = query.id;
    }

    console.warn(
      'this.cumulativeUsersAndTheirSockets',
      this.cumulativeUsersAndTheirSockets,
    );

    this.users++;

    this.server.emit('users', this.users);
  }

  async handleDisconnect() {
    this.users--;

    this.server.emit('users', this.users);
  }

  @SubscribeMessage('todo')
  handleMessage(
    userId: number,
    eventType: 'created' | 'updated' | 'deleted',
    data: {
      id: number;
      title?: string;
      description?: string;
      completed?: boolean;
    },
  ) {
    const socketId = this.cumulativeUsersAndTheirSockets[userId];

    this.server.to(socketId).emit(eventType, data);
  }
}
