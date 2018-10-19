import nanoTimer from 'nanotimer';

class Delay {
  constructor(fn, time, killPrevious = false) {
    this.fn = fn;
    this.time = time;
    this.killPrevious = killPrevious;

    this.timer = new nanoTimer();
  }

  async run() {
    if (this.killPrevious) {
      this.kill();
    }

    const result = await new Promise((resolve, reject) => {
      this.timer.setTimeout(async () => resolve(await this.fn()), '', this.time);
    });

    return result;
  }

  kill() {
    return this.timer.clearTimeout();
  }
}

export default Delay;
