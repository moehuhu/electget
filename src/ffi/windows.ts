import koffi from 'koffi';
import {
  DWMWA_EXCLUDED_FROM_PEEK,
  GWLP_HWNDPARENT,
  HWND,
  HWND_BOTTOM,
  HWND_TOP,
  SWP_NOMOVE,
  SWP_NOSIZE,
  SWP_NOZORDER,
  WINDOWPOS,
} from '../constants.js';
import { getHWnd } from '../helper.js';
import { Win } from '../helper.js';

export const isWindows = process.platform === 'win32';

function loadUser32() {
  const lib = koffi.load('user32.dll');
  // SetWindowLongPtrA is only exported on 64-bit Windows; on 32-bit it is a
  // macro for SetWindowLongA.
  const setWindowLongPtr =
    process.arch === 'ia32' ? 'SetWindowLongA' : 'SetWindowLongPtrA';
  return {
    FindWindowExA: lib.func('__stdcall', 'FindWindowExA', HWND, [
      HWND,
      HWND,
      'str',
      'str',
    ]),
    GetDesktopWindow: lib.func('__stdcall', 'GetDesktopWindow', HWND, []),
    SetWindowLongPtrA: lib.func('__stdcall', setWindowLongPtr, 'intptr_t', [
      HWND,
      'int',
      'intptr_t',
    ]),
    SetWindowPos: lib.func('__stdcall', 'SetWindowPos', 'bool', [
      HWND,
      HWND,
      'int',
      'int',
      'int',
      'int',
      'uint',
    ]),
    SetParent: lib.func('__stdcall', 'SetParent', HWND, [HWND, HWND]),
  };
}

function loadDwmapi() {
  const lib = koffi.load('dwmapi.dll');
  return {
    DwmSetWindowAttribute: lib.func(
      '__stdcall',
      'DwmSetWindowAttribute',
      'long',
      [HWND, 'uint32_t', 'void *', 'uint32_t']
    ),
  };
}

export const user32 = isWindows ? loadUser32() : null;

export const dwmapi = isWindows ? loadDwmapi() : null;

export function getDesktopWindow() {
  return user32?.GetDesktopWindow() as number;
}

export function getSHELLDLL_DefViewHandle() {
  const progman = user32?.FindWindowExA(0, 0, 'Progman', null) as number;
  let defView = user32?.FindWindowExA(progman, 0, 'SHELLDLL_DefView', null);

  if (!defView) {
    // find again
    const desktopHWnd = user32?.GetDesktopWindow() as number;
    let workerW = 0;
    do {
      workerW = user32?.FindWindowExA(desktopHWnd, workerW, 'WorkerW', null);
      defView = user32?.FindWindowExA(workerW, 0, 'SHELLDLL_DefView', null);
    } while (!defView && workerW);
  }

  if (!defView) throw new Error('Not found SHELLDLL_DefView window handle.');

  return defView as number;
}

export function setOwnerWindow(win: Win, target: Win | number) {
  if (!user32) return false;
  const hWnd = getHWnd(win);
  const targetWnd = getHWnd(target);
  user32.SetWindowLongPtrA(hWnd, GWLP_HWNDPARENT, targetWnd);

  return true;
}

export function setParentWindow(win: Win, target: Win) {
  const hWnd = getHWnd(win);
  const targetWnd = getHWnd(target);
  user32?.SetParent(hWnd, targetWnd);
}

// lParam of WM_WINDOWPOSCHANGING holds a pointer to a WINDOWPOS struct.
export function ignoreChangeZOrder(wParam: Buffer, lParam: Buffer) {
  const windowPosPtr = koffi.decode(lParam, 'void *');
  if (!windowPosPtr) return;
  const windowPos = koffi.decode(windowPosPtr, WINDOWPOS);

  koffi.encode(
    windowPosPtr,
    koffi.offsetof(WINDOWPOS, 'flags'),
    'uint32_t',
    windowPos.flags | SWP_NOZORDER
  );
}

export function preventFromAeroPeek(win: Win) {
  if (!dwmapi) return false;
  const hWnd = getHWnd(win);
  // DWMWA_EXCLUDED_FROM_PEEK expects a Win32 BOOL (4 bytes).
  const value = Buffer.alloc(4);
  value.writeInt32LE(1);
  dwmapi.DwmSetWindowAttribute(
    hWnd,
    DWMWA_EXCLUDED_FROM_PEEK,
    value,
    value.length
  );
  return true;
}

export function zOrderToBottom(win: Win) {
  if (!user32) return false;
  const hWnd = getHWnd(win);
  user32.SetWindowPos(hWnd, HWND_BOTTOM, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);

  return true;
}

export function zOrderToTop(win: Win) {
  if (!user32) return false;
  const hWnd = getHWnd(win);
  user32.SetWindowPos(hWnd, HWND_TOP, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);

  return true;
}
