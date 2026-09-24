import { BrowserWindow } from 'electron';
import { ElectgetModule } from './index.js';
import { WM_WINDOWPOSCHANGING } from '../constants.js';
import {
  getDesktopWindow,
  getSHELLDLL_DefViewHandle,
  ignoreChangeZOrder,
  preventFromAeroPeek,
  setOwnerWindow,
  zOrderToBottom,
  zOrderToTop,
} from '../ffi/windows.js';
import { Win } from '../helper.js';

export class WindowsModule implements ElectgetModule {
  preventFromAeroPeek(win: Win) {
    return preventFromAeroPeek(win);
  }

  preventFromShowDesktop(win: Win) {
    return setOwnerWindow(win, getSHELLDLL_DefViewHandle());
  }

  cancelPreventFromShowDesktop(win: Win) {
    return setOwnerWindow(win, getDesktopWindow());
  }

  preventChangeZOrder(browserWindow: BrowserWindow) {
    browserWindow.hookWindowMessage(WM_WINDOWPOSCHANGING, ignoreChangeZOrder);

    return () => this.cancelPreventChangeZOrder(browserWindow);
  }

  cancelPreventChangeZOrder(browserWindow: BrowserWindow) {
    browserWindow.unhookWindowMessage(WM_WINDOWPOSCHANGING);
  }

  moveToBottom(win: Win) {
    return zOrderToBottom(win);
  }

  moveToTop(win: Win) {
    return zOrderToTop(win);
  }

  alwaysOnBottom(browserWindow: BrowserWindow) {
    const hWnd = browserWindow.getNativeWindowHandle();
    this.moveToBottom(hWnd);
    this.preventChangeZOrder(browserWindow);
    this.preventFromShowDesktop(hWnd);
  }

  cancelAlwaysOnBottom(browserWindow: BrowserWindow) {
    const hWnd = browserWindow.getNativeWindowHandle();
    browserWindow.unhookWindowMessage(WM_WINDOWPOSCHANGING);
    this.cancelPreventFromShowDesktop(hWnd);
  }

  alwaysOnTop(browserWindow: BrowserWindow) {
    const hWnd = browserWindow.getNativeWindowHandle();
    this.moveToTop(hWnd);
    this.preventChangeZOrder(browserWindow);
  }

  cancelAlwaysOnTop(browserWindow: BrowserWindow) {
    browserWindow.unhookWindowMessage(WM_WINDOWPOSCHANGING);
  }
}
