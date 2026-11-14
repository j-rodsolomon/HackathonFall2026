import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export type MenuSection =
  | 'Health'
  | 'Hearing'
  | 'Activity'
  | 'Sleep'
  | 'Resources'
  | 'Settings';

type MenuItem = {
  label: MenuSection;
  icon: ImageSourcePropType;
};

const menuItems: MenuItem[] = [
  { label: 'Health', icon: require('@/assets/images/healthIcon.png') },
  { label: 'Hearing', icon: require('@/assets/images/hearingIcon.png') },
  { label: 'Activity', icon: require('@/assets/images/activity.png') },
  { label: 'Sleep', icon: require('@/assets/images/sleepIcon.png') },
  { label: 'Resources', icon: require('@/assets/images/resourcesIcon.png') },
  { label: 'Settings', icon: require('@/assets/images/settingsIcon.png') },
];

type MenuProps = {
  onSelect?: (section: MenuSection) => void;
};

export default function Menu({ onSelect }: MenuProps) {
  const [selectedSection, setSelectedSection] = useState<MenuSection>('Health');

  function selectSection(section: MenuSection) {
    setSelectedSection(section);
    onSelect?.(section);
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            Menu
          </ThemedText>
          <ThemedText style={styles.subtitle}>Choose a section to get started</ThemedText>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.grid}>
            {menuItems.map((item) => {
              const isSelected = selectedSection === item.label;

              return (
                <Pressable
                  key={item.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => selectSection(item.label)}
                  style={({ pressed }) => [
                    styles.button,
                    isSelected && styles.buttonSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                  <ThemedText type="smallBold" style={styles.label}>
                    {item.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
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
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: '#2563EB',
  },
  container: {
    flexGrow: 1,
    gap: Spacing.four,
    padding: Spacing.four,
  },
  title: {
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#DBEAFE',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.three,
  },
  button: {
    width: '48%',
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: '#C9DCF7',
    backgroundColor: '#FFFFFF',
    padding: Spacing.three,
  },
  buttonSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EAF3FF',
  },
  icon: {
    width: 44,
    height: 44,
  },
  label: {
    color: '#173B73',
  },
  pressed: {
    opacity: 0.75,
  },
});