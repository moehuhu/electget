import { BrowserWindow } from 'electron';
import { WindowsModule } from './windows.js';
import { Win } from '../helper.js';

export interface ElectgetModule {
  preventFromAeroPeek(win: Win): boolean;

  preventFromShowDesktop(win: Win): boolean;

  cancelPreventFromShowDesktop(win: Win): boolean;

  preventChangeZOrder(browserWindow: BrowserWindow): () => void;

  cancelPreventChangeZOrder(browserWindow: BrowserWindow): void;

  moveToBottom(win: Win): boolean;

  moveToTop(win: Win): boolean;

  alwaysOnBottom(browserWindow: BrowserWindow): void;

  cancelAlwaysOnBottom(browserWindow: BrowserWindow): void;

  alwaysOnTop(browserWindow: BrowserWindow): void;

  cancelAlwaysOnTop(browserWindow: BrowserWindow): void;
}

export class Electget {
  platform: NodeJS.Platform;
  module: ElectgetModule;

  constructor() {
    this.platform = process.platform;

    if (this.platform !== 'win32') {
      throw new Error(
        `This module is not currently supported by OS: ${this.platform}`
      );
    }

    this.module = new WindowsModule();
  }

  preventFromAeroPeek(win: Win) {
    return this.module?.preventFromAeroPeek(win);
  }

  preventFromShowDesktop(win: Win) {
    return this.module?.preventFromShowDesktop(win);
  }

  cancelPreventFromShowDesktop(win: Win) {
    return this.module?.cancelPreventFromShowDesktop(win);
  }

  preventChangeZOrder(browserWindow: BrowserWindow) {
    return this.module?.preventChangeZOrder(browserWindow);
  }

  cancelPreventChangeZOrder(browserWindow: BrowserWindow) {
    return this.module?.cancelPreventChangeZOrder(browserWindow);
  }

  moveToBottom(win: Win) {
    return this.module?.moveToBottom(win);
  }

  moveToTop(win: Win) {
    return this.module?.moveToTop(win);
  }

  alwaysOnBottom(browserWindow: BrowserWindow) {
    return this.module?.alwaysOnBottom(browserWindow);
  }

  cancelAlwaysOnBottom(browserWindow: BrowserWindow) {
    return this.module?.cancelAlwaysOnBottom(browserWindow);
  }

  alwaysOnTop(browserWindow: BrowserWindow) {
    return this.module?.alwaysOnTop(browserWindow);
  }

  cancelAlwaysOnTop(browserWindow: BrowserWindow) {
    return this.module?.cancelAlwaysOnTop(browserWindow);
  }
}
