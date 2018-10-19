class ClientCollection {
  constructor(arraySet = false) {
    //Collection -> Set -> Client
    this.collection = {};
    this.arraySet = arraySet;
  }

  getSetNames() {
    return Object.keys(this.collection);
  }

  hasSet(name) {
    return Object.keys(this.collection).includes(name);
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

  deregisterClient(client, set) {
    if (this.arraySet) {
      if (this.collection[set] && this.collection[set].includes(client)) {
        const index = client.indexOf(client);

        this.collection[set].splice(index, 1);
      }
    } else {
      if (Object.keys(this.collection).includes(set)) {
        delete this.collection[set];
      }
    }
  }

  broadcast(message, set) {
    if (!this.arraySet) {
      throw new Error('Not array collection, the broadcast method is invalid.');
    }

    this.collection[set].map(client => {
      client.send(message);
    });
  }

  send(message, set) {
    if (this.arraySet) {
      throw new Error(
        'This Collection is an array collection, the send method is invalid.'
      );
    }

    this.collection[set].send(message);
  }
}

export default ClientCollection;