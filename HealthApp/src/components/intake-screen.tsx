import { useState } from 'react';
import {
  Text, TextInput, Pressable, ScrollView, View,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth';

type Question = {
  key: string;
  title: string;
  type: 'choice' | 'scale' | 'text';
  options?: string[];
  optional?: boolean;
};

const INJURIES = ['Knee', 'Shoulder', 'Back', 'Neck', 'Ankle / Foot', 'Wrist / Hand', 'Other'];

// Question 4 changes depending on the injury picked in question 1
const SPECIFIC: Record<string, { title: string; options: string[] }> = {
  Knee: {
    title: 'Which movement bothers your knee most?',
    options: ['Stairs', 'Squatting', 'Walking or running', 'Standing up from a chair'],
  },
  Shoulder: {
    title: 'Which movement is hardest for your shoulder?',
    options: ['Lifting overhead', 'Reaching behind me', 'Carrying things', 'Sleeping on it'],
  },
  Back: {
    title: 'When is your back pain worst?',
    options: ['Sitting', 'Bending over', 'In the morning', 'After activity'],
  },
  Neck: {
    title: 'What triggers your neck pain?',
    options: ['Looking down at my phone', 'Turning my head', 'Desk work', 'Sleeping'],
  },
  'Ankle / Foot': {
    title: 'What is hardest on your ankle or foot?',
    options: ['Walking', 'Running', 'Stairs', 'Balancing'],
  },
  'Wrist / Hand': {
    title: 'What is hardest for your wrist or hand?',
    options: ['Gripping', 'Typing', 'Lifting', 'Twisting'],
  },
  Other: {
    title: 'What makes it worse?',
    options: ['Movement', 'Resting', 'Certain positions', 'Time of day'],
  },
};

function getQuestions(injury?: string): Question[] {
  const specific = SPECIFIC[injury ?? 'Other'] ?? SPECIFIC.Other;
  return [
    { key: 'injury', title: 'What was your most recent injury or ailment?', type: 'choice', options: INJURIES },
    { key: 'onset', title: 'When did it start?', type: 'choice',
      options: ['This week', '1 to 4 weeks ago', '1 to 3 months ago', 'More than 3 months ago'] },
    { key: 'pain', title: 'How much does it hurt right now?', type: 'scale' },
    { key: 'specific', title: specific.title, type: 'choice', options: specific.options },
    { key: 'notes', title: 'Anything else you want your doctor to know?', type: 'text', optional: true },
  ];
}

export default function IntakeScreen() {
  const { saveIntake } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = getQuestions(answers.injury);
  const q = questions[step];
  const value = answers[q.key] ?? '';
  const isLast = step === questions.length - 1;
  const canContinue = q.optional || value !== '';

  const setAnswer = (v: string) =>
    setAnswers((prev) =>
      // changing the injury resets the injury-specific answer
      q.key === 'injury' ? { ...prev, injury: v, specific: '' } : { ...prev, [q.key]: v }
    );

  const next = () => (isLast ? saveIntake(answers) : setStep(step + 1));

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.step}>Question {step + 1} of {questions.length}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${((step + 1) / questions.length) * 100}%` }]} />
          </View>

          <Text style={styles.title}>{q.title}</Text>

          {q.type === 'choice' &&
            q.options?.map((opt) => (
              <Pressable
                key={opt}
                style={[styles.option, value === opt && styles.optionSelected]}
                onPress={() => setAnswer(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            ))}

          {q.type === 'scale' && (
            <>
              <View style={styles.scaleRow}>
                {Array.from({ length: 11 }, (_, i) => String(i)).map((n) => (
                  <Pressable
                    key={n}
                    style={[styles.scaleBtn, value === n && styles.optionSelected]}
                    onPress={() => setAnswer(n)}
                  >
                    <Text style={styles.optionText}>{n}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.hint}>0 = no pain, 10 = worst pain imaginable</Text>
            </>
          )}

          {q.type === 'text' && (
            <TextInput
              style={styles.textArea}
              placeholder="Optional. Symptoms, medications, questions..."
              placeholderTextColor="#64748B"
              multiline
              value={value}
              onChangeText={setAnswer}
            />
          )}

          <View style={styles.buttons}>
            {step > 0 && (
              <Pressable style={styles.backBtn} onPress={() => setStep(step - 1)}>
                <Text style={styles.backText}>Back</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.nextBtn, !canContinue && styles.disabled]}
              onPress={next}
              disabled={!canContinue}
            >
              <Text style={styles.nextText}>{isLast ? 'Finish' : 'Next'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 24, gap: 12 },
  step: { color: '#2563EB', fontSize: 14 },
  track: { height: 6, backgroundColor: '#DBEAFE', borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: '#2563EB' },
  title: { color: '#173B73', fontSize: 26, fontWeight: '700', marginVertical: 16 },
  option: {
    borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 16,
  },
  optionSelected: { borderColor: '#2563EB', backgroundColor: '#EAF3FF' },
  optionText: { color: '#173B73', fontSize: 16 },
  scaleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scaleBtn: {
    width: 52, height: 52, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#FFFFFF', borderRadius: 12,
  },
  hint: { color: '#64748B', fontSize: 14 },
  textArea: {
    minHeight: 120, textAlignVertical: 'top', color: '#173B73', fontSize: 16, padding: 14,
    borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#FFFFFF', borderRadius: 12,
  },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  backBtn: {
    flex: 1, padding: 16, borderRadius: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  backText: { color: '#2563EB', fontSize: 16, fontWeight: '600' },
  nextBtn: { flex: 2, backgroundColor: '#2563EB', padding: 16, borderRadius: 12, alignItems: 'center' },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.4 },
});