import { Image } from 'expo-image';
import { type Href, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/brand-logo';
import { Colors, EletroShopColors } from '@/constants/theme';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isDark = scheme === 'dark';
  const isCompact = width < 640;
  const theme = Colors[isDark ? 'dark' : 'light'];
  const accent = isDark ? EletroShopColors.darkAccent : EletroShopColors.accent;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.pageContent}>
        <BrandLogo compact textColor={theme.text} />

        <View style={[styles.hero, isCompact && styles.heroCompact]}>
          <Image
            source={require('@/assets/images/brand/eos-app-icon.png')}
            style={styles.icon}
            contentFit="contain"
          />
          <View style={styles.heroText}>
            <Text style={[styles.eyebrow, { color: accent }]}>
              GESTÃO DE PRODUTOS
            </Text>
            <Text
              style={[
                styles.title,
                isCompact && styles.titleCompact,
                { color: theme.text },
              ]}>
              Seu estoque, simples e conectado.
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Escolha uma opção para gerenciar os produtos da EletroShop.
            </Text>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          <HomeAction
            href="/products"
            icon="▤"
            title="Lista de produtos"
            description="Consulte, filtre, edite e exclua produtos."
            textColor={theme.text}
            secondaryColor={theme.textSecondary}
            cardColor={theme.backgroundElement}
          />
          <HomeAction
            href="/create-product"
            icon="+"
            title="Cadastrar produto"
            description="Adicione um novo item ao catálogo."
            textColor={theme.text}
            secondaryColor={theme.textSecondary}
            cardColor={theme.backgroundElement}
          />
          <HomeAction
            icon="⌁"
            title="Consulta à API"
            description="Acesso direto aos dados retornados pela API."
            textColor={theme.text}
            secondaryColor={theme.textSecondary}
            cardColor={theme.backgroundElement}
          />
          <HomeAction
            icon="▣"
            title="Produtos locais"
            description="Visualize a última lista salva no dispositivo."
            textColor={theme.text}
            secondaryColor={theme.textSecondary}
            cardColor={theme.backgroundElement}
          />
        </View>

        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          EletroShop • Gerenciamento de produtos
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeAction({
  href,
  icon,
  title,
  description,
  textColor,
  secondaryColor,
  cardColor,
}: {
  href?: Href;
  icon: string;
  title: string;
  description: string;
  textColor: string;
  secondaryColor: string;
  cardColor: string;
}) {
  const content = (
    <Pressable
      accessibilityRole={href ? 'button' : undefined}
      accessibilityState={{ disabled: !href }}
      disabled={!href}
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor: cardColor },
        !href && styles.actionDisabled,
        pressed && styles.actionPressed,
      ]}>
      <View style={styles.actionHeader}>
        <View style={styles.actionIcon}>
          <Text style={styles.actionIconText}>{icon}</Text>
        </View>
        {!href && <Text style={styles.pendingBadge}>Em integração</Text>}
      </View>
      <Text style={[styles.actionTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.actionDescription, { color: secondaryColor }]}>
        {description}
      </Text>
      {href && <Text style={styles.actionLink}>Acessar →</Text>}
    </Pressable>
  );

  return href ? (
    <Link href={href} asChild>
      {content}
    </Link>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  pageContent: {
    marginHorizontal: 'auto',
    maxWidth: 920,
    padding: 24,
    paddingBottom: 32,
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 28,
    marginTop: 54,
  },
  heroCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginTop: 36,
  },
  icon: {
    height: 124,
    width: 124,
  },
  heroText: { flex: 1 },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 44,
  },
  titleCompact: {
    fontSize: 32,
    lineHeight: 38,
  },
  description: {
    fontSize: 17,
    lineHeight: 25,
    marginTop: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 42,
  },
  actionCard: {
    borderRadius: 16,
    flexBasis: 320,
    flexGrow: 1,
    minHeight: 190,
    padding: 20,
  },
  actionDisabled: { opacity: 0.62 },
  actionPressed: { opacity: 0.72 },
  actionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: EletroShopColors.primary,
    borderRadius: 10,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  actionIconText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E8',
    borderRadius: 999,
    color: '#8A3B00',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 18,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  actionLink: {
    color: EletroShopColors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 14,
  },
  footer: {
    fontSize: 12,
    marginTop: 32,
    textAlign: 'center',
  },
});
