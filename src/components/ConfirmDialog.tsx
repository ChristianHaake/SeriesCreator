import { useEffect, useId, useRef, useState } from 'react';
import { CreatorDialog } from '../creator/CreatorShell';
import { useTranslation } from '../i18n';

interface Props {
  /** The question to answer. */
  message: string;
  returnFocus: React.RefObject<HTMLElement | null>;
  /** Present for a rename-style prompt; omit for a plain confirmation. */
  defaultValue?: string;
  /** Label for the affirmative button; falls back to a generic confirm. */
  confirmLabel?: string;
  /** Marks the action as destructive so the button reads as such. */
  destructive?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, returnFocus, defaultValue, confirmLabel, destructive, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue ?? '');
  const input = useRef<HTMLInputElement>(null);
  const formId = useId();
  const isPrompt = defaultValue !== undefined;
  useEffect(() => { if (isPrompt) input.current?.select(); }, [isPrompt]);
  const confirm = () => {
    if (isPrompt && !value.trim()) { input.current?.focus(); return; }
    onConfirm(value.trim());
  };
  return (
    <CreatorDialog open returnFocus={returnFocus} title={message} className="confirm-dialog" onCancel={onCancel}
      cancelLabel={t.btnCancel} actions={
        <button type="submit" form={formId}
          className={`ui-button${destructive ? ' ui-button--danger' : ''}`}>
          {confirmLabel ?? t.btnConfirm}
        </button>
      }>
      <form id={formId} onSubmit={event => { event.preventDefault(); confirm(); }}>
        {isPrompt && <input ref={input} type="text" className="confirm-dialog__input"
          aria-label={message} value={value} onChange={event => setValue(event.target.value)} />}
      </form>
    </CreatorDialog>
  );
}
