class ClientCollection {
  constructor(arraySet = false) {
    //Collection -> Set -> Client
    this.collection = {};
    this.arraySet = arraySet;
  }

  registerClient(client, set) {
    if (this.arraySet) {
      if (!this.collection[set]) {
        this.collection[set] = [];
      }

      if (!this.collection[set].includes(client)) {
        this.collection[set].push(client);
      }
    } else {
      if (!this.collection[set]) {
        this.collection[set] = client;
      }
    }
  }

  deregisterClient(arg1, arg2) {
    if (this.arraySet) {
      const client = arguments[0];
      const set = arguments[1];

      if (this.collection[set] && this.collection[set].includes(client)) {
        const index = this.collection[set].indexOf(client);

        this.collection[set].splice(index, 1);
      }
    } else {
      const set = arguments[0];

      if (Object.keys(this.collection).includes(set)) {
        delete this.collection[set];
      }
    }
  }

  map(fn) {
    return Object.entries(this.collection).map(([set, client], index) => {
      return fn(set, client, index);
    });
  }

  forEach(fn) {
    return Object.entries(this.collection).forEach(([set, client], index) => {
      return fn(set, client, index);
    });
  }

  querySetName(client) {
    let result;

    result = [];

    if (this.arraySet) {
      Object.entries(this.collection).map(entry => {
        if (entry[1].includes(client)) {
          result.push(entry[0]);
        }
      });
    } else {
      Object.entries(this.collection).map(entry => {
        if (entry[1] === client) {
          result.push(entry[0]);
        }
      });
    }

    return result;
  }

  hasSet(name) {
    return this.collection.hasOwnProperty(name);
    //return name in this.collection;
    //return Object.keys(this.collection).includes(name);
  }

  getNames() {
    return Object.keys(this.collection);
  }
  getClients() {
    return Object.values(this.collection);
  }

  getSet(set) {
    return this.collection[set];
  }

  _broadcastToSet(message, set) {
    if (this.hasSet(set)) {
      this.collection[set].map(client => {
        client.send(message);
      });
    }
  }

  _broadcastToAll(message) {
    if (this.arraySet) {
      this.forEach((set, clients) =>
        clients.map(client => client.send(message))
      );
    } else {
      this.forEach((set, client) => client.send(message));
    }
  }

  broadcast(message, set) {
    if (!this.arraySet) {
      throw new Error('Not array collection, the broadcast method is invalid.');
    }

    if (set !== '*') {
      if (Array.isArray(set)) {
        set.map(s => this._broadcastToSet(message, s));
      } else {
        this._broadcastToSet(message, set);
      }
    } else {
      this._broadcastToAll(message);
    }
  }

  _send(message, set) {
    this.collection[set].send(message);
  }

  send(message, set) {
    if (this.arraySet) {
      throw new Error(
        'This Collection is an array collection, the send method is invalid.'
      );
    }

    if (Array.isArray(set)) {
      set.map(s => this._send(message, s));
    } else {
      this._send(message, set);
    }
  }
}

export default ClientCollection;
