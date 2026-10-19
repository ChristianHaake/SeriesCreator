import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n';

interface Props {
  /** The question to answer. */
  message: string;
  /** Present for a rename-style prompt; omit for a plain confirmation. */
  defaultValue?: string;
  /** Label for the affirmative button; falls back to a generic confirm. */
  confirmLabel?: string;
  /** Marks the action as destructive so the button reads as such. */
  destructive?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

/**
 * Built on the native <dialog> element, which supplies the focus trap, Escape
 * handling, inert background and top-layer stacking that a hand-rolled modal
 * has to reimplement.
 */
export function ConfirmDialog({
  message,
  defaultValue,
  confirmLabel,
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPrompt = defaultValue !== undefined;
  const [value, setValue] = useState(defaultValue ?? '');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog?.isConnected || dialog.open) return;
    dialog.showModal();
    if (isPrompt) inputRef.current?.select();
  }, [isPrompt]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-message"
      // Fires for Escape and for form method="dialog" alike.
      onCancel={onCancel}
      onClose={onCancel}
    >
      <form
        method="dialog"
        onSubmit={(event) => {
          // A prompt must not submit an empty name.
          if (isPrompt && value.trim() === '') {
            event.preventDefault();
            inputRef.current?.focus();
            return;
          }
          onConfirm(value.trim());
        }}
      >
        <p id="confirm-dialog-message" className="confirm-dialog__message">{message}</p>

        {isPrompt && (
          <input
            ref={inputRef}
            type="text"
            className="confirm-dialog__input"
            aria-label={message}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        )}

        <div className="confirm-dialog__actions">
          <button type="button" className="ui-button" onClick={onCancel}>
            {t.btnCancel}
          </button>
          <button
            type="submit"
            className={`ui-button${destructive ? ' ui-button--danger' : ''}`}
          >
            {confirmLabel ?? t.btnConfirm}
          </button>
        </div>
      </form>
    </dialog>
  );
}
