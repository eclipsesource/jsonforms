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
import {
  AnimationOptions,
  App,
  Config,
  DeepLinkConfig,
  DeepLinker,
  DomController,
  GestureController,
  IonicApp,
  Nav,
  PageTransition,
  Platform,
  UrlSerializer,
  ViewController
} from 'ionic-angular';
import { Location } from '@angular/common';
import { ElementRef, NgZone, Renderer } from '@angular/core';
import { TransitionController } from 'ionic-angular/transitions/transition-controller';
import { OverlayPortal } from 'ionic-angular/components/app/overlay-portal';

const noop = () => {
  // do nothing
};

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
        .forEach(t => t.callback());
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

export const mockPlatform = (): PlatformMock => {
  return new PlatformMock();
};

export const mockLocation = (): Location => {
  return {
    path: () => '',
    subscribe: noop,
    go: noop,
    back: noop,
    prepareExternalUrl: noop
  } as any;
};

export const mockRenderer = (): Renderer => {
  return {
    setElementAttribute: (
      renderElement: MockElement,
      name: string,
      val: any
    ) => {
      if (name === null) {
        renderElement.removeAttribute(name);
      } else {
        renderElement.setAttribute(name, val);
      }
    },
    setElementClass: (
      renderElement: MockElement,
      className: string,
      isAdd: boolean
    ) => {
      if (isAdd) {
        renderElement.classList.add(className);
      } else {
        renderElement.classList.remove(className);
      }
    },
    setElementStyle: (
      renderElement: MockElement,
      styleName: string,
      styleValue: string
    ) => {
      renderElement.style[styleName] = styleValue;
    }
  } as Renderer;
};

export class MockDomController extends DomController {
  constructor(private mockedPlatform: PlatformMock) {
    super(mockedPlatform);
  }

  flush(done: any) {
    this.mockedPlatform.flushTimeouts(() => {
      this.mockedPlatform.flushRafs((timeStamp: number) => {
        done(timeStamp);
      });
    });
  }

  flushUntil(timeout: number, done: any) {
    this.mockedPlatform.flushTimeoutsUntil(timeout, () => {
      this.mockedPlatform.flushRafs((timeStamp: number) => {
        done(timeStamp);
      });
    });
  }
}

export const mockDomController = (platform?: PlatformMock) => {
  return new MockDomController(platform || mockPlatform());
};

export const mockOverlayPortal = (
  app: App,
  config: Config,
  plt: PlatformMock
): OverlayPortal => {
  const zone = mockZone();
  const dom = mockDomController(plt);
  const elementRef = mockElementRef();
  const renderer = mockRenderer();
  const componentFactoryResolver: any = null;
  const gestureCtrl = new GestureController(app);
  const serializer = new UrlSerializer(app, null);
  const location: Location = mockLocation();
  const deepLinker = new DeepLinker(app, serializer, location, null, null);

  return new OverlayPortal(
    app as any,
    config as any,
    plt as any,
    elementRef,
    zone,
    renderer,
    componentFactoryResolver,
    gestureCtrl as any,
    null,
    deepLinker as any,
    null,
    dom as any,
    null
  );
};

export const mockIonicApp = (
  app: App,
  config: Config,
  plt: PlatformMock
): IonicApp => {
  const appRoot = new IonicApp(
    null,
    null,
    mockElementRef(),
    mockRenderer(),
    config,
    plt,
    app
  );

  appRoot._loadingPortal = mockOverlayPortal(app, config, plt) as any;
  appRoot._toastPortal = mockOverlayPortal(app, config, plt) as any;
  appRoot._overlayPortal = mockOverlayPortal(app, config, plt) as any;
  appRoot._modalPortal = mockOverlayPortal(app, config, plt) as any;

  return appRoot;
};

export const mockApp = (config?: Config, platform?: PlatformMock) => {
  platform = platform || mockPlatform();
  config = config || mockConfig(null, '/', platform);
  const app = new App(config, platform);
  mockIonicApp(app, config, platform);
  return app;
};

export const mockConfig = (config?: any, _url = '/', platform?: Platform) => {
  const c = new Config();
  const p = platform || mockPlatform();
  c.init(config, p);
  return c;
};

export const mockDeepLinker = (
  linkConfig: DeepLinkConfig = null,
  app?: App
) => {
  app = app || mockApp(mockConfig(), mockPlatform());
  const serializer = new UrlSerializer(app, linkConfig);
  const location = mockLocation();

  return new DeepLinker(app || mockApp(), serializer, location, null, null);
};

export const mockTransitionController = (
  config: Config
): TransitionController => {
  const platform: any = mockPlatform();
  platform.raf = (callback: Function) => {
    callback();
  };
  const trnsCtrl: any = new TransitionController(platform, config as any);
  trnsCtrl.get = (
    trnsId: number,
    enteringView: ViewController,
    leavingView: ViewController,
    opts: AnimationOptions
  ) => {
    const trns = new PageTransition(platform, enteringView, leavingView, opts);
    trns.trnsId = trnsId;
    return trns;
  };
  return trnsCtrl;
};

export const mockZone = (): NgZone => {
  return new NgZone({ enableLongStackTrace: false });
};

export const mockNav = (): Nav => {
  const platform = mockPlatform();
  const config = mockConfig(null, '/', platform);
  const app = mockApp(config, platform);
  const zone = mockZone();
  const dom = mockDomController(platform);
  const elementRef = mockElementRef();
  const renderer = mockRenderer();
  const componentFactoryResolver: any = null;
  const gestureCtrl = new GestureController(app);
  const linker = mockDeepLinker(null, app);
  const trnsCtrl = mockTransitionController(config);
  return new Nav(
    null,
    null,
    app,
    config,
    platform,
    elementRef,
    zone,
    renderer,
    componentFactoryResolver,
    gestureCtrl,
    trnsCtrl as any,
    linker,
    dom,
    null
  );
};

export class MockElementRef implements ElementRef {
  nativeElement: any;
  constructor(ele: any) {
    this.nativeElement = ele;
  }
}

export const mockElementRef = (): ElementRef => {
  return new MockElementRef(new MockElement());
};

export class MockElement {
  children: any[] = [];
  classList = new ClassList();
  attributes: { [name: string]: any } = {};
  style: { [property: string]: any } = {};
  nodeName = 'ION-MOCK';

  clientWidth = 0;
  clientHeight = 0;
  offsetWidth = 0;
  offsetHeight = 0;
  offsetTop = 0;
  scrollTop = 0;
  scrollHeight = 0;

  get className() {
    return this.classList.classes.join(' ');
  }

  set className(val: string) {
    this.classList.classes = val.split(' ');
  }

  hasAttribute(name: string) {
    return !!this.attributes[name];
  }

  getAttribute(name: string) {
    return this.attributes[name];
  }

  setAttribute(name: string, val: any) {
    this.attributes[name] = val;
  }

  addEventListener() {
    // do nothing
  }

  removeEventListener() {
    // do nothing
  }

  removeAttribute(name: string) {
    delete this.attributes[name];
  }
}

export class ClassList {
  classes: string[] = [];
  add(className: string) {
    if (!this.contains(className)) {
      this.classes.push(className);
    }
  }
  remove(className: string) {
    const index = this.classes.indexOf(className);
    if (index > -1) {
      this.classes.splice(index, 1);
    }
  }
  toggle(className: string) {
    if (this.contains(className)) {
      this.remove(className);
    } else {
      this.add(className);
    }
  }
  contains(className: string) {
    return this.classes.indexOf(className) > -1;
  }
}
