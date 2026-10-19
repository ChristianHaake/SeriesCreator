import '@testing-library/jest-dom/vitest';

class TestStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

if (!window.localStorage) {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: new TestStorage(),
  });
}

// jsdom does not implement the <dialog> methods. The app relies on the native
// element for focus trapping and Escape handling, so give the tests a minimal
// stand-in that keeps the open/closed state observable.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

// jsdom hides [popover] through its UA stylesheet but implements none of the
// Popover API, so the header's overflow menu would be permanently unreachable.
// Give the tests the parts the app relies on: the two methods, and the
// popovertarget attribute that opens a menu from its button.
if (typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover !== 'function') {
  HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
    this.style.display = 'block';
    this.setAttribute('data-popover-open', 'true');
  };
  HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
    this.style.removeProperty('display');
    this.removeAttribute('data-popover-open');
  };
  document.addEventListener('click', (event) => {
    const trigger = (event.target as HTMLElement | null)?.closest?.('[popovertarget]');
    if (!trigger) return;
    const target = document.getElementById(trigger.getAttribute('popovertarget')!);
    if (!target) return;
    if (target.hasAttribute('data-popover-open')) {
      target.style.removeProperty('display');
      target.removeAttribute('data-popover-open');
    } else {
      target.style.display = 'block';
      target.setAttribute('data-popover-open', 'true');
    }
  });
}
