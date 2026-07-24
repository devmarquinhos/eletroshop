import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, EletroShopColors } from '@/constants/theme';
import { BrandLogo } from '@/components/brand-logo';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = Colors[isDark ? 'dark' : 'light'];
  const accent = isDark ? EletroShopColors.darkAccent : EletroShopColors.accent;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.header}>
        <BrandLogo compact textColor={theme.text} />
      </View>

      <View style={styles.content}>
        <Image
          source={require('@/assets/images/brand/eos-app-icon.png')}
          style={styles.iconContainer}
          contentFit="contain"
        />

        <Text style={[styles.eyebrow, { color: accent }]}>GESTÃO DE PRODUTOS</Text>
        <Text style={[styles.title, { color: theme.text }]}>Seu estoque, simples e conectado.</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Cadastre e organize os produtos da sua loja em um só lugar.
        </Text>

        <Link href="/create-product" style={[styles.primaryButton, { backgroundColor: accent }]}>
          Cadastrar novo produto
        </Link>
        <Link
          href="/products"
          style={[styles.secondaryButton, { borderColor: EletroShopColors.primary, color: theme.text }]}>
          Ver produtos
        </Link>
      </View>

      <Text style={[styles.footer, { color: theme.textSecondary }]}>EletroShop • Gerenciamento de produtos</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 20,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 'auto',
    maxWidth: 620,
    paddingBottom: 48,
    width: '100%',
  },
  iconContainer: {
    height: 112,
    marginBottom: 30,
    width: 112,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.2,
    lineHeight: 48,
    maxWidth: 560,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    lineHeight: 27,
    marginTop: 18,
    maxWidth: 480,
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 34,
    overflow: 'hidden',
    paddingHorizontal: 28,
    paddingVertical: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
    overflow: 'hidden',
    paddingHorizontal: 28,
    paddingVertical: 14,
    textAlign: 'center',
  },
  footer: {
    fontSize: 12,
    paddingBottom: 16,
    textAlign: 'center',
  },
});
