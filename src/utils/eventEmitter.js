class EventEmitter {
  constructor() {
    this.listeners = Object.create(null);
  }

  on(type, cb) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(cb);
  }

  once(type, cb) {
    const func = (...params) => {
      cb(...params);
      this.off(cb);
    };
    this.on(type, func);
  }

  emit(type, ...params) {
    if (this.listeners[type]) {
      this.listeners[type].forEach(cb => {
        cb(...params);
      });
    }
  }

  off(type, cb) {
    if (this.listeners[type]) {
      const index = this.listeners[type].findIndex(item => item === cb);
      if (index !== -1) {
        this.listeners[type].splice(index, 1);
      }
      if (this.listeners[type].length === 0) {
        delete this.listeners[type];
      }
    }
  }

  offAll(type) {
    if (this.listeners[type]) {
      delete this.listeners[type];
    }
  }
}

export default new EventEmitter();
