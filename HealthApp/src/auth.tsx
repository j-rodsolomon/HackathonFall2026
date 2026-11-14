import { createContext, useContext, useState, ReactNode } from 'react';

export type Intake = Record<string, string>;

type AuthValue = {
  user: string | null;
  intake: Intake | null;
  signIn: (email: string) => void;
  saveIntake: (answers: Intake) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue>({
  user: null,
  intake: null,
  signIn: () => {},
  saveIntake: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [intake, setIntake] = useState<Intake | null>(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        intake,
        signIn: setUser,
        saveIntake: setIntake,
        signOut: () => {
          setUser(null);
          setIntake(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);