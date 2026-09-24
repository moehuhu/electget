import os from 'os';
import { BrowserWindow } from 'electron';

export type Win = BrowserWindow | Buffer;

export function getHWnd(win: Win | number) {
  if (win instanceof BrowserWindow)
    return readBufferByOS(win.getNativeWindowHandle());
  else if (Buffer.isBuffer(win)) return readBufferByOS(win);
  else if (typeof win === 'number' && !Number.isNaN(win)) return win;
  else throw new Error(`Type that doesn't support: ${win}`);
}

export function readBufferByOS(buf: Buffer) {
  const le = os.endianness() == 'LE';
  if (buf.length >= 8)
    return Number(le ? buf.readBigInt64LE() : buf.readBigInt64BE());
  return le ? buf.readInt32LE() : buf.readInt32BE();
}
