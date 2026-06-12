"use client";

import { createContext, useContext } from "react";

type CustomerPanelContextValue = {
  isPanelHidden: boolean;
  togglePanel: () => void;
};

const CustomerPanelContext = createContext<CustomerPanelContextValue | null>(
  null,
);

export function CustomerPanelProvider({
  isPanelHidden,
  togglePanel,
  children,
}: CustomerPanelContextValue & {
  children: React.ReactNode;
}) {
  return (
    <CustomerPanelContext.Provider value={{ isPanelHidden, togglePanel }}>
      {children}
    </CustomerPanelContext.Provider>
  );
}

export function useCustomerPanel() {
  return useContext(CustomerPanelContext);
}
