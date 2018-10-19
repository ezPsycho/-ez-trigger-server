import ClientCollection from './ClientCollection';

class Program {
  constructor(server) {
    this.server = server;
    this.logger = server.logger;

    this.registerCommand = server.registerCommand;
    this.deregisterCommand = server.deregisterCommand;

    this.channels = new ClientCollection(true);
  }

  addClientToChannel(client, set) {
    this.channels.registerClient(client, set);
  }

  removeClientFromChannel(client, set) {
    this.channels.deregisterClient(client, set);
  }

  broadcastByType(message, set) {
    this.server.broadcast(message, set);
  }

  broadcastByChannel(message, set) {
    this.channels.broadcast(message, set);
  }

  broadcastToAll(message) {
    this.server.broadcast(message, '*');
  }

  broadcast() {
    //not implemented.
    // Check type first, if exists, broadcast;
    // Check channel if type not exists, if exists, broadcast.
    // Reconstruct the Server class firstly, to makesure all 
    //  client collection uses the new 'ClientCollection' class.
  }

  send(message, id) {
    this.server.send(message, id);
  }
}

export default Program;