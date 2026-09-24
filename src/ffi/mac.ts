import { BrowserWindow } from 'electron';
import { loadNSWindow } from './nswindow.cjs';
import { Win } from '../helper.js';

export const GetNSWindowCollectionBehaviorDefault = () =>
  loadNSWindow().GetNSWindowCollectionBehaviorDefault();
export const GetNSWindowCollectionBehaviorCanJoinAllSpaces = () =>
  loadNSWindow().GetNSWindowCollectionBehaviorCanJoinAllSpaces();
export const GetNSWindowCollectionBehaviorStationary = () =>
  loadNSWindow().GetNSWindowCollectionBehaviorStationary();

export function SetCollectionBehavior(win: Win, value: number) {
  let handle: Buffer;
  if (win instanceof BrowserWindow) {
    handle = win.getNativeWindowHandle();
  } else {
    handle = win;
  }
  loadNSWindow().SetCollectionBehavior(handle, value);
}
