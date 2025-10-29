// Cesta: src/shared/hooks/useModal.js
// Hook pro jednoduchou správu dialogů a modálů

import { useState, useCallback } from 'react';

/**
 * Hook pro správu modálů a dialogů
 *
 * Použití:
 *   const modal = useModal();
 *
 *   // V JSX:
 *   <Button onClick={modal.open}>Otevřít</Button>
 *   <Dialog open={modal.isOpen} onClose={modal.close}>...</Dialog>
 *
 *   // S daty:
 *   const modal = useModal();
 *   modal.open({ userId: 123 });
 *   console.log(modal.data); // { userId: 123 }
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data to allow closing animation
    setTimeout(() => setData(null), 300);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    data,
    setData,
  };
};

/**
 * Hook pro správu multi-step dialogů
 *
 * Použití:
 *   const wizard = useWizard(3); // 3 kroky
 *
 *   <Button onClick={wizard.next}>Další</Button>
 *   <Button onClick={wizard.back}>Zpět</Button>
 *   <Typography>{wizard.currentStep + 1} / {wizard.totalSteps}</Typography>
 */
export const useWizard = (totalSteps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isOpen, open, close, data, setData } = useModal();

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const back = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback(
    (step) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return {
    isOpen,
    open,
    close,
    data,
    setData,
    currentStep,
    totalSteps,
    next,
    back,
    goToStep,
    reset,
    isFirstStep,
    isLastStep,
    progress,
  };
};

/**
 * Hook pro confirmation dialogy
 *
 * Použití:
 *   const confirm = useConfirm();
 *
 *   const handleDelete = async () => {
 *     const confirmed = await confirm.ask({
 *       title: 'Smazat položku?',
 *       message: 'Tuto akci nelze vrátit zpět.'
 *     });
 *
 *     if (confirmed) {
 *       // delete logic
 *     }
 *   };
 */
export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Potvrzení',
    message: 'Jste si jistí?',
    confirmText: 'Ano',
    cancelText: 'Ne',
  });
  const [resolvePromise, setResolvePromise] = useState(null);

  const ask = useCallback((customConfig = {}) => {
    setConfig({ ...config, ...customConfig });
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, [config]);

  const confirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
    }
    setIsOpen(false);
    setResolvePromise(null);
  }, [resolvePromise]);

  const cancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
    }
    setIsOpen(false);
    setResolvePromise(null);
  }, [resolvePromise]);

  return {
    isOpen,
    config,
    ask,
    confirm,
    cancel,
  };
};
