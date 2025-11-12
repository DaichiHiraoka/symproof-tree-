/**
 * Flag通知システム Provider
 * Atlaskit Flagを使用したトースト通知管理
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FlagGroup, AutoDismissFlag, type AppearanceTypes } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import InfoIcon from '@atlaskit/icon/glyph/info';

export interface FlagConfig {
  id?: string;
  title: string;
  description?: ReactNode;
  appearance: AppearanceTypes;
  actions?: Array<{
    content: string;
    onClick: () => void;
  }>;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

interface FlagContextType {
  showFlag: (config: Omit<FlagConfig, 'id'>) => void;
  showSuccess: (title: string, description?: ReactNode) => void;
  showError: (title: string, description?: ReactNode) => void;
  showWarning: (title: string, description?: ReactNode) => void;
  showInfo: (title: string, description?: ReactNode) => void;
}

const FlagContext = createContext<FlagContextType | undefined>(undefined);

interface StoredFlag extends FlagConfig {
  id: string;
}

export function FlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<StoredFlag[]>([]);

  const removeFlag = useCallback((id: string) => {
    setFlags((prev) => prev.filter((flag) => flag.id !== id));
  }, []);

  const showFlag = useCallback((config: Omit<FlagConfig, 'id'>) => {
    const id = `flag-${Date.now()}-${Math.random()}`;
    const newFlag: StoredFlag = {
      ...config,
      id,
      autoClose: config.autoClose ?? true,
      autoCloseDelay: config.autoCloseDelay ?? 5000,
    };

    setFlags((prev) => [...prev, newFlag]);

    // Auto close after delay
    if (newFlag.autoClose) {
      setTimeout(() => {
        removeFlag(id);
      }, newFlag.autoCloseDelay);
    }
  }, [removeFlag]);

  const showSuccess = useCallback(
    (title: string, description?: ReactNode) => {
      showFlag({
        title,
        description,
        appearance: 'success',
      });
    },
    [showFlag]
  );

  const showError = useCallback(
    (title: string, description?: ReactNode) => {
      showFlag({
        title,
        description,
        appearance: 'error',
        autoClose: false, // Errors should not auto-close
      });
    },
    [showFlag]
  );

  const showWarning = useCallback(
    (title: string, description?: ReactNode) => {
      showFlag({
        title,
        description,
        appearance: 'warning',
      });
    },
    [showFlag]
  );

  const showInfo = useCallback(
    (title: string, description?: ReactNode) => {
      showFlag({
        title,
        description,
        appearance: 'info',
      });
    },
    [showFlag]
  );

  const getIcon = (appearance: AppearanceTypes) => {
    switch (appearance) {
      case 'success':
        return SuccessIcon;
      case 'error':
        return ErrorIcon;
      case 'warning':
        return WarningIcon;
      case 'info':
        return InfoIcon;
      default:
        return InfoIcon;
    }
  };

  return (
    <FlagContext.Provider
      value={{
        showFlag,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <FlagGroup onDismissed={(id) => removeFlag(String(id))}>
        {flags.map((flag) => {
          const IconComponent = getIcon(flag.appearance);
          return (
            <AutoDismissFlag
              key={flag.id}
              id={flag.id}
              icon={<IconComponent label={flag.appearance} />}
              title={flag.title}
              description={flag.description}
              appearance={flag.appearance}
              actions={flag.actions}
            />
          );
        })}
      </FlagGroup>
    </FlagContext.Provider>
  );
}

export function useFlag() {
  const context = useContext(FlagContext);
  if (context === undefined) {
    throw new Error('useFlag must be used within a FlagProvider');
  }
  return context;
}
