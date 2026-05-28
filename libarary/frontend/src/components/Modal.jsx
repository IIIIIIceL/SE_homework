import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Modal.module.css';

export default function Modal({ visible, title, children, onConfirm, onCancel, confirmText = '确定', cancelText = '取消', danger = false, prompt = false, defaultValue = '' }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setInputValue(defaultValue);
      if (prompt && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [visible, defaultValue, prompt]);

  const handleConfirm = useCallback(() => {
    onConfirm?.(prompt ? inputValue : undefined);
    setInputValue('');
  }, [onConfirm, inputValue, prompt]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    setInputValue('');
  }, [onCancel]);

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>{title}</div>
        <div className={styles.body}>
          {children}
          {prompt && <input
            ref={inputRef}
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
          />}
        </div>
        <div className={styles.footer}>
          <button className={styles.btn} onClick={handleCancel}>{cancelText}</button>
          <button className={`${styles.btnPrimary} ${danger ? styles.btnDanger : ''}`} onClick={handleConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
