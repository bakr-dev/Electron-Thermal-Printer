// augmentations.d.ts
import type { Notification } from 'quasar';

declare global {
  interface Notify extends Notification {
    (options: Notification): void;
  }
}

export {};
