import React, { createContext, useContext } from 'react';

export interface ShadcnStyleOverrides {
  inputClasses?: string;
  labelClasses?: string;
  errorClasses?: string;
  descriptionClasses?: string;
  wrapperClasses?: string;
}

export const ShadcnStyleContext = createContext<ShadcnStyleOverrides>({});

export const useShadcnStyles = () => useContext(ShadcnStyleContext);

export interface ShadcnStyleProviderProps {
  value: ShadcnStyleOverrides;
  children: React.ReactNode;
}

export const ShadcnStyleProvider: React.FC<ShadcnStyleProviderProps> = ({
  value,
  children,
}) => {
  return (
    <ShadcnStyleContext.Provider value={value}>
      {children}
    </ShadcnStyleContext.Provider>
  );
};
