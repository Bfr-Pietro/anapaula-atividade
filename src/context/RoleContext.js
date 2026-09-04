import React, { createContext, useContext, useState } from 'react';

// Controla o perfil de acesso escolhido na tela inicial.
// role pode ser: 'admin' | 'usuario' | null
const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null);

  const isAdmin = role === 'admin';

  return (
    <RoleContext.Provider value={{ role, setRole, isAdmin }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole precisa ser usado dentro de um RoleProvider');
  }
  return context;
}
