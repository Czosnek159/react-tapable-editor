import { bindEvents } from "../../utils/event/bindEvents";
import Container from "./Container";
import Dragger from "./Dragger";
import { findClosestContainer, isElement } from "./dom";
import defaultConfig from "./defaultConfig";
import { setContainerAttributes, setDraggerAttributes } from "./setAttributes";
import mutationHandler from "./mutationHandler";

bindEvents(window, {
  eventName: "mousedown",
  fn: e => {
    console.log("mouse down");
  }
});

class DND {
  constructor({ configs = [], rootElement }) {
    this.containers = {};
    this.handleContainers();
    this.configs = configs.map(config => ({
      ...defaultConfig,
      ...config
    }));
    this.rootElement = rootElement;

    this.startObserve();
    this.setUp();
  }

  startObserve() {
    let rootElement = this.rootElement;

    if (!isElement(rootElement)) {
      const el = document.querySelector(this.rootElement);
      if (el) rootElement = el;
    }

    const observer = new MutationObserver(mutationHandler(this));

    observer.observe(rootElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * extract `containerSelectors` and prepare `container` and `dragger`
   */
  setUp() {
    this.containerSelectors = this.configs.map(config => {
      const { containerSelector } = config;
      return containerSelector;
    });

    this.containerSelectors.forEach(containerSelector =>
      this.handleContainers(containerSelector)
    );

    this.handleDraggers();
  }

  handleContainers(containerSelector) {
    const elements = document.querySelectorAll(containerSelector);
    if (!elements) return;

    elements.forEach(el => this.handleContainerElement(el));
  }

  handleContainerElement(el) {
    const container = new Container({ el, containers: this.containers });
    setContainerAttributes(container);
  }

  handleDraggers(container = document) {
    this.configs.forEach(config => {
      const { draggerSelector } = config;
      this.handleDraggerInContainer(container, draggerSelector);
    });
  }

  handleDraggerInContainer(container, draggerSelector) {
    const elements = container.querySelectorAll(draggerSelector);
    if (!elements) return;
    elements.forEach(el => this.handleDraggerElement(el));
  }

  /**
   *
   * @param {HTMLElement} el
   * 1. Find closest container node first.
   * 2. Update container's children
   * 3. set dragger element's attributes.
   *
   */
  handleDraggerElement(el) {
    const container = findClosestContainer(this.containers, el);
    if (container === -1) return;
    const dragger = new Dragger({ el, container });
    container.addDirectChild(dragger);
    setDraggerAttributes(container, dragger);
  }
}

export default DND;
