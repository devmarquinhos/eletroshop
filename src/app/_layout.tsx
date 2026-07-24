import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-product" />
        <Stack.Screen name="api-products" />
        <Stack.Screen name="products/index" />
        <Stack.Screen name="products/[id]" />
        <Stack.Screen name="products/[id]/edit" />
      </Stack>
    </ThemeProvider>
  );
}
