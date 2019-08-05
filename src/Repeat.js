import { isNull } from 'util';

import nanoTimer from 'nanotimer';

class Repeat {
  constructor(fn, interval, times = null) {
    this.fn = fn;
    this.interval = interval;
    this.times = times;
    this.count = 0;

    this.timer = new nanoTimer();
  }

  reset() {
    this.kill();
    this.count = 0;
  }

  async run() {
    this.reset();

    const result = await new Promise((resolve, reject) => {
      this.timer.setInterval(async () => {
          this.count++;

          if (!isNull(this.times) && this.count <= this.times) {
            await this.fn(this.timer, this.count);
          } else {
            this.timer.clearInterval();
            resolve();
          }
        },
        '',
        this.interval
      );
    });

    return result;
  }

  kill() {
    return this.timer.clearInterval();
  }
}

export default Repeat;
