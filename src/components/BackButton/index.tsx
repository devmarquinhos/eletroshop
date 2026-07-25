import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { styles } from './styles';

type BackButtonProps = {
  label?: string;
};

export function BackButton({ label = 'Voltar' }: BackButtonProps) {
  const router = useRouter();

  function handleGoBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={handleGoBack}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}>
      <Text style={styles.icon}>←</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
