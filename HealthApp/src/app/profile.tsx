import { useState, ComponentProps } from 'react';
import {
  ScrollView, View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useProfile, Profile } from '@/context/profile';

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const emailOk = (s: string) => /^\S+@\S+\.\S+$/.test(s.trim());

export default function ProfileScreen() {
  const { profile, saveProfile } = useProfile();
  const [form, setForm] = useState<Profile>(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({});
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Profile) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Partial<Record<keyof Profile, string>> = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!emailOk(form.email)) e.email = 'Enter a valid email';
    const age = Number(form.age);
    if (!age || age < 1 || age > 120) e.age = 'Enter a valid age';
    if (!(Number(form.weight) > 0)) e.weight = 'Enter a valid weight';
    if (!(Number(form.height) > 0)) e.height = 'Enter a valid height';
    if (!form.gender) e.gender = 'Please choose one';
    // Doctor fields are optional, but if an email is given it must be valid
    if (form.doctorEmail && !emailOk(form.doctorEmail)) e.doctorEmail = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;
    await saveProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = (
    label: string, key: keyof Profile, opts: ComponentProps<typeof TextInput> = {},
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] && styles.inputError]}
        value={form[key]}
        onChangeText={set(key)}
        {...opts}
      />
      {errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Your Profile</Text>

        {field('Full name', 'name', { autoCapitalize: 'words', textContentType: 'name' })}
        {field('Email', 'email', { keyboardType: 'email-address', autoCapitalize: 'none', textContentType: 'emailAddress' })}
        {field('Age', 'age', { keyboardType: 'number-pad' })}
        {field('Weight (kg)', 'weight', { keyboardType: 'decimal-pad' })}
        {field('Height (cm)', 'height', { keyboardType: 'decimal-pad' })}

        <View style={styles.field}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.chips}>
            {GENDERS.map((g) => (
              <Pressable
                key={g}
                onPress={() => set('gender')(g)}
                style={[styles.chip, form.gender === g && styles.chipActive]}
              >
                <Text style={form.gender === g ? styles.chipTextActive : undefined}>{g}</Text>
              </Pressable>
            ))}
          </View>
          {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}
        </View>

        <Text style={styles.section}>Your doctor (optional)</Text>
        {field("Doctor's name", 'doctorName', { autoCapitalize: 'words' })}
        {field("Doctor's email", 'doctorEmail', { keyboardType: 'email-address', autoCapitalize: 'none' })}

        {saved ? <Text style={styles.success}>Profile saved!</Text> : null}

        <Pressable style={styles.button} onPress={onSave}>
          <Text style={styles.buttonText}>Save profile</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 14 },
  title: { fontSize: 28, fontWeight: 'bold' },
  section: { fontSize: 20, fontWeight: '600', marginTop: 12 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 12, fontSize: 16 },
  inputError: { borderColor: '#d33' },
  error: { color: '#d33', fontSize: 13 },
  success: { color: '#16a34a', fontSize: 15, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#999', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipTextActive: { color: 'white' },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});