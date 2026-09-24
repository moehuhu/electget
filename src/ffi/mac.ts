import { BrowserWindow } from 'electron';
import * as nswindowNamespace from 'nswindow-napi';
import { Win } from '../helper.js';

// nswindow-napi is a CommonJS native addon; under ESM its functions are only
// reachable through the default export.
const nswindow = ((nswindowNamespace as any).default ??
  nswindowNamespace) as typeof nswindowNamespace;

export const GetNSWindowCollectionBehaviorDefault = () =>
  nswindow.GetNSWindowCollectionBehaviorDefault();
export const GetNSWindowCollectionBehaviorCanJoinAllSpaces = () =>
  nswindow.GetNSWindowCollectionBehaviorCanJoinAllSpaces();
export const GetNSWindowCollectionBehaviorStationary = () =>
  nswindow.GetNSWindowCollectionBehaviorStationary();

export function SetCollectionBehavior(win: Win, value: number) {
  let handle: Buffer;
  if (win instanceof BrowserWindow) {
    handle = win.getNativeWindowHandle();
  } else {
    handle = win;
  }
  nswindow.SetCollectionBehavior(handle, value);
}
