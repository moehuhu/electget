import koffi from 'koffi';

export const SWP_NOZORDER = 4;
export const SWP_NOMOVE = 2;
export const SWP_NOSIZE = 1;

export const HWND_TOP = 0;
export const HWND_BOTTOM = 1;
export const WM_WINDOWPOSCHANGING = 70;

export const DWMWA_EXCLUDED_FROM_PEEK = 12;

export const GWLP_HWNDPARENT = -8;

// Window handles are pointer-sized; pass them around as integers.
// Types stay anonymous: koffi registers named types globally, so a name would
// clash with other koffi users or with the CJS and ESM builds loaded together.
export const HWND = 'intptr_t';

export const WINDOWPOS = koffi.struct({
  hwnd: HWND,
  hwndInsertAfter: HWND,
  x: 'int',
  y: 'int',
  cx: 'int',
  cy: 'int',
  flags: 'uint32_t',
});
