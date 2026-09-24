// `nswindow-napi` is a macOS-only native addon that is compiled at install
// time. It must never be loaded on other platforms, otherwise requiring this
// package would try to `dlopen` a Mach-O binary on Windows and fail.
//
// This file is intentionally written as a CommonJS module (`.cts` compiles to
// `.cjs` in both the CJS and ESM builds) so that the addon is loaded through
// `require` only when `loadNSWindow()` is actually called, i.e. on macOS.

type NSWindowNapi = typeof import('nswindow-napi');

let cached: NSWindowNapi | undefined;

export function loadNSWindow(): NSWindowNapi {
  if (!cached) {
    cached = require('nswindow-napi') as NSWindowNapi;
  }
  return cached;
}
