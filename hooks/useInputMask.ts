import { useEffect, useRef } from 'react';

export type MaskType = 'cpf' | 'cep' | 'placa' | 'telefone' | 'email';

export function useInputMask(mask: MaskType | undefined) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!mask || !inputRef.current) return;

    const input = inputRef.current;

    const applyMask = (value: string): string => {
      const digits = value.replace(/\D/g, '');
      
      switch (mask) {
        case 'cpf':
          return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        case 'cep':
          return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
        case 'placa':
          return digits.replace(/([A-Za-z]{3})(\d{1})([A-Za-z0-9]{1})(\d{2})/, '$1$2$3$4');
        case 'telefone':
          return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        default:
          return value;
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const maskedValue = applyMask(target.value);
      target.value = maskedValue;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Permitir teclas de navegação
      const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ];
      
      if (allowedKeys.includes(e.key)) {
        return;
      }

      // Para CPF, CEP e telefone, permitir apenas números
      if (['cpf', 'cep', 'telefone'].includes(mask)) {
        if (!/\d/.test(e.key)) {
          e.preventDefault();
        }
      }

      // Para placa, permitir letras e números
      if (mask === 'placa') {
        if (!/[A-Za-z0-9]/.test(e.key)) {
          e.preventDefault();
        }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData?.getData('text') || '';
      const maskedValue = applyMask(pastedText);
      input.value = maskedValue;
    };

    // Adicionar event listeners
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeyDown);
    input.addEventListener('paste', handlePaste);

    // Cleanup
    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('keydown', handleKeyDown);
      input.removeEventListener('paste', handlePaste);
    };
  }, [mask]);

  return inputRef;
}

