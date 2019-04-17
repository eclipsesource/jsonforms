/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
// import { Platform } from 'ionic-angular';
//
// export class PlatformMock extends Platform {
//   private timeoutIds = 0;
//   private timeouts: {
//     callback: Function;
//     timeout: number;
//     timeoutId: number;
//   }[] = [];
//   private rafIds = 0;
//   private timeStamps = 0;
//   private rafs: { callback: Function; rafId: number }[] = [];
//
//   constructor() {
//     super();
//     const doc = document.implementation.createHTMLDocument('');
//     this.setWindow(window);
//     this.setDocument(doc);
//     this.setCssProps(doc.documentElement);
//   }
//
//   timeout(callback: Function, timeout: number) {
//     const timeoutId = ++this.timeoutIds;
//
//     this.timeouts.push({
//       callback: callback,
//       timeout: timeout,
//       timeoutId: timeoutId
//     });
//
//     return timeoutId;
//   }
//
//   cancelTimeout(timeoutId: number) {
//     for (let i = 0; i < this.timeouts.length; i++) {
//       if (timeoutId === this.timeouts[i].timeoutId) {
//         this.timeouts.splice(i, 1);
//         break;
//       }
//     }
//   }
//
//   flushTimeouts(done: Function) {
//     setTimeout(() => {
//       this.timeouts
//         .sort((a, b) => {
//           if (a.timeout < b.timeout) {
//             return -1;
//           }
//           if (a.timeout > b.timeout) {
//             return 1;
//           }
//           return 0;
//         })
//         .forEach(t => {
//           t.callback();
//         });
//       this.timeouts.length = 0;
//       done();
//     });
//   }
//
//   flushTimeoutsUntil(timeout: number, done: Function) {
//     setTimeout(() => {
//       this.timeouts.sort((a, b) => {
//         if (a.timeout < b.timeout) {
//           return -1;
//         }
//         if (a.timeout > b.timeout) {
//           return 1;
//         }
//         return 0;
//       });
//
//       const keepers: any[] = [];
//       this.timeouts.forEach(t => {
//         if (t.timeout < timeout) {
//           t.callback();
//         } else {
//           keepers.push(t);
//         }
//       });
//
//       this.timeouts = keepers;
//       done();
//     });
//   }
//
//   raf(callback: ((timeStamp?: number) => void) | Function): number {
//     const rafId = ++this.rafIds;
//     this.rafs.push({
//       callback: callback,
//       rafId: rafId
//     });
//     return rafId;
//   }
//
//   cancelRaf(rafId: number) {
//     for (let i = 0; i < this.rafs.length; i++) {
//       if (rafId === this.rafs[i].rafId) {
//         this.rafs.splice(i, 1);
//         break;
//       }
//     }
//   }
//
//   flushRafs(done: Function) {
//     const timestamp = ++this.timeStamps;
//     setTimeout(() => {
//       this.rafs.forEach(raf => {
//         raf.callback(timestamp);
//       });
//       this.rafs.length = 0;
//       done(timestamp);
//     });
//   }
// }
