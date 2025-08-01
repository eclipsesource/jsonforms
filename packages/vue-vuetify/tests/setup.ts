// Mock the visualViewport API for testing purposes
if (!window.visualViewport) {
  window.visualViewport = {
    addEventListener: () => {},
    removeEventListener: () => {},
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    onresize: null,
    onscroll: null,
    dispatchEvent: () => true,
  };
}
