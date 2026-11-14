import { createContext, useContext, useState, ReactNode } from 'react';

type AuthValue = {
  user: string | null;
  signIn: (email: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  return (
    <AuthContext.Provider
      value={{ user, signIn: setUser, signOut: () => setUser(null) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);