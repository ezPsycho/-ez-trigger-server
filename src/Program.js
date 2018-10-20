import { Records } from '@ez-trigger/core';

import { i } from './console';
import ClientCollection from './ClientCollection';

class Program {
  constructor(server, recordInfo) {
    this.server = server;
    this.logger = server.logger;

    this.localRecords = {};
    this.globalRecords = server.records;

    this.registeredCommands = new Set();

    this.actions = [];
    this.recordActions = [];
    this.programActions = [];

    this.send = server.send;
    this.log = logger.log;

    this.addGlobalRecord = server.records.add;
    this.clearGlobalRecord = server.records.clear;
    this.exportGlobalRecord = server.records.export;

    this.localRecords = Object.entries(recordInfo).map(([id, name]) => {
      const localRecord = new Records(this.server.paths.recordExport);

      this.localRecords[id] = {
        id,
        name,
        record: localRecord
      };

      localRecord.on('record-updated', () => {
        this.server.emit('local-record-updated');
      })
    });

    this.channels = new ClientCollection(true);
  }

  setActions(actions) {
    this.programActions = [];

    Object.entries(actions).map(([name, fn]) => {
      this.programActions.push({ name, fn });
    });

    return this.programActions;
  }

  getActions() {
    return this.actions;
  }

  updateActions() {
    this._updateRecordActions();
    this.actions = this.programActions.concat(this.recordActions);

    return this.actions;
  }

  _updateRecordActions() {
    this.recordActions = [];

    Object.entries(this.localRecords).map(([id, { name, record }]) => ({
      name: `${name} [${record.data.length}]`,
      fn: async () => {
        const exportPath = await record.export(id);
        this.log(i(`Exported '${id}' to ${exportPath}.`));
      }
    }));
  }

  addLocalRecord(data, id) {
    this.localRecords[id].record.add(data);
  }

  clearLocalRecord(id) {
    this.localRecords[id].record.clear();
  }

  exportLocalRecord(id) {
    this.localRecords[id].record.export(id);
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

  registerCommand(command, fn) {
    this.registeredCommands.add(command);
    this.server.commands.register(command, fn.bind(this));
  }

  deregisterCommand(command) {
    this.registeredCommands.delete(command);
    this.server.commands.deregister(command);
  }

  clearCommands() {
    this.registeredCommands.forEach(command =>
      this.server.commands.deregister(command)
    );
  }
}

export default Program;
