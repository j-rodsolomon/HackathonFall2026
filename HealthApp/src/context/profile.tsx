import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type Profile = {
  name: string;
  email: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
  doctorName: string;
  doctorEmail: string;
};

export const emptyProfile: Profile = {
  name: '', email: '', age: '', weight: '', height: '',
  gender: '', doctorName: '', doctorEmail: '',
};

// Every answer in the app lives here, saved under a name like "age" or "sleepHours"
export type Answers = Record<string, string>;

type AnswersContextType = {
  answers: Answers;
  setAnswer: (key: string, value: string) => void;
  setManyAnswers: (values: Answers) => void;
  clearAnswers: () => void;
};

const AnswersContext = createContext<AnswersContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({});

  const setAnswer = (key: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const setManyAnswers = (values: Answers) =>
    setAnswers((prev) => ({ ...prev, ...values }));

  const clearAnswers = () => setAnswers({});

  return (
    <AnswersContext.Provider value={{ answers, setAnswer, setManyAnswers, clearAnswers }}>
      {children}
    </AnswersContext.Provider>
  );
}

// Use this anywhere to read or save answers
export function useAnswers() {
  const ctx = useContext(AnswersContext);
  if (!ctx) throw new Error('useAnswers must be used inside ProfileProvider');
  return ctx;
}

// Same hook as before, now built on the answers store
export function useProfile() {
  const { answers, setManyAnswers } = useAnswers();

  // useMemo keeps the same object until the answers actually change
  const profile = useMemo<Profile>(() => {
    const p = { ...emptyProfile };
    (Object.keys(emptyProfile) as (keyof Profile)[]).forEach((k) => {
      if (answers[k] !== undefined) p[k] = answers[k];
    });
    return p;
  }, [answers]);

  const saveProfile = async (p: Profile) => setManyAnswers({ ...p });

  return { profile, loaded: true, saveProfile };
}