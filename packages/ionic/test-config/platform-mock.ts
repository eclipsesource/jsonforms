import { Platform } from 'ionic-angular';

export class PlatformMock extends Platform {
  private timeoutIds = 0;
  private timeouts: {
    callback: Function;
    timeout: number;
    timeoutId: number;
  }[] = [];
  private rafIds = 0;
  private timeStamps = 0;
  private rafs: { callback: Function; rafId: number }[] = [];

  constructor() {
    super();
    const doc = document.implementation.createHTMLDocument('');
    this.setWindow(window);
    this.setDocument(doc);
    this.setCssProps(doc.documentElement);
  }

  timeout(callback: Function, timeout: number) {
    const timeoutId = ++this.timeoutIds;

    this.timeouts.push({
      callback: callback,
      timeout: timeout,
      timeoutId: timeoutId
    });

    return timeoutId;
  }

  cancelTimeout(timeoutId: number) {
    for (let i = 0; i < this.timeouts.length; i++) {
      if (timeoutId === this.timeouts[i].timeoutId) {
        this.timeouts.splice(i, 1);
        break;
      }
    }
  }

  flushTimeouts(done: Function) {
    setTimeout(() => {
      this.timeouts
        .sort((a, b) => {
          if (a.timeout < b.timeout) {
            return -1;
          }
          if (a.timeout > b.timeout) {
            return 1;
          }
          return 0;
        })
        .forEach(t => {
          t.callback();
        });
      this.timeouts.length = 0;
      done();
    });
  }

  flushTimeoutsUntil(timeout: number, done: Function) {
    setTimeout(() => {
      this.timeouts.sort((a, b) => {
        if (a.timeout < b.timeout) {
          return -1;
        }
        if (a.timeout > b.timeout) {
          return 1;
        }
        return 0;
      });

      const keepers: any[] = [];
      this.timeouts.forEach(t => {
        if (t.timeout < timeout) {
          t.callback();
        } else {
          keepers.push(t);
        }
      });

      this.timeouts = keepers;
      done();
    });
  }

  raf(callback: ((timeStamp?: number) => void) | Function): number {
    const rafId = ++this.rafIds;
    this.rafs.push({
      callback: callback,
      rafId: rafId
    });
    return rafId;
  }

  cancelRaf(rafId: number) {
    for (let i = 0; i < this.rafs.length; i++) {
      if (rafId === this.rafs[i].rafId) {
        this.rafs.splice(i, 1);
        break;
      }
    }
  }

  flushRafs(done: Function) {
    const timestamp = ++this.timeStamps;
    setTimeout(() => {
      this.rafs.forEach(raf => {
        raf.callback(timestamp);
      });
      this.rafs.length = 0;
      done(timestamp);
    });
  }
}
