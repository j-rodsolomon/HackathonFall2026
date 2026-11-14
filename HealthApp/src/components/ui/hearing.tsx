import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type Side = 'left' | 'right';

type HearingScreenProps = {
  onBack: () => void;
};

export default function HearingScreen({ onBack }: HearingScreenProps) {
  const leftPlayer = useAudioPlayer(require('@/assets/audio/hearing-left.wav'));
  const rightPlayer = useAudioPlayer(require('@/assets/audio/hearing-right.wav'));
  const [targetSide, setTargetSide] = useState<Side | null>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(
    () => () => {
      leftPlayer.pause();
      rightPlayer.pause();
    },
    [leftPlayer, rightPlayer]
  );

  async function playSound() {
    const side: Side = Math.random() < 0.5 ? 'left' : 'right';
    const player = side === 'left' ? leftPlayer : rightPlayer;
    const otherPlayer = side === 'left' ? rightPlayer : leftPlayer;

    setError('');
    setFeedback('');
    setTargetSide(null);

    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      otherPlayer.pause();
      await player.seekTo(0);
      player.volume = 0.65;
      player.play();
      setTargetSide(side);
    } catch {
      setError('The sound could not be played. Check your volume and try again.');
    }
  }

  function chooseSide(side: Side) {
    if (!targetSide) return;

    setFeedback(
      side === targetSide
        ? 'Correct! You heard the sound on the ' + side + '.'
        : 'Not quite. The sound played on the ' + targetSide + '.'
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <ThemedText style={styles.backText}>‹ Menu</ThemedText>
          </Pressable>
          <ThemedText type="subtitle" style={styles.title}>
            Hearing Check
          </ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={require('@/assets/images/hearingIcon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <ThemedText type="subtitle" style={styles.prompt}>
            Which side do you hear?
          </ThemedText>
          <ThemedText style={styles.instructions}>
            Connect headphones, play a sound, and choose whether you heard it on the left or right.
            Keep your device volume comfortable.
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            onPress={playSound}
            style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}>
            <ThemedText style={styles.playButtonText}>
              {targetSide ? 'Play another sound' : 'Play sound'}
            </ThemedText>
          </Pressable>

          <View style={styles.sideButtons}>
            {(['left', 'right'] as const).map((side) => (
              <Pressable
                key={side}
                accessibilityRole="button"
                accessibilityState={{ disabled: !targetSide }}
                disabled={!targetSide}
                onPress={() => chooseSide(side)}
                style={({ pressed }) => [
                  styles.sideButton,
                  targetSide && styles.sideButtonEnabled,
                  pressed && styles.pressed,
                ]}>
                <ThemedText
                  style={[styles.sideButtonText, targetSide && styles.sideButtonTextEnabled]}>
                  {side === 'left' ? 'Left side' : 'Right side'}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          {feedback ? <ThemedText style={styles.feedback}>{feedback}</ThemedText> : null}
          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          <ThemedText style={styles.disclaimer}>
            This is a simple listening activity, not a medical hearing test.
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    gap: Spacing.two,
    backgroundColor: '#2563EB',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  backText: {
    color: '#DBEAFE',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  icon: {
    width: 88,
    height: 88,
  },
  prompt: {
    color: '#173B73',
    textAlign: 'center',
  },
  instructions: {
    color: '#64748B',
    textAlign: 'center',
  },
  playButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sideButtons: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignSelf: 'stretch',
  },
  sideButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C9DCF7',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    backgroundColor: '#F8FAFC',
  },
  sideButtonEnabled: {
    borderColor: '#2563EB',
    backgroundColor: '#EAF3FF',
  },
  sideButtonText: {
    color: '#94A3B8',
    fontWeight: '700',
  },
  sideButtonTextEnabled: {
    color: '#173B73',
  },
  feedback: {
    color: '#173B73',
    textAlign: 'center',
    fontWeight: '600',
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
  },
  disclaimer: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});