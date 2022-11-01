import { Buffer } from 'buffer';
(window as any).global = window;
(window as any).Buffer = Buffer;
if (!window.process) window.process = { env: {} } as any;
export { }