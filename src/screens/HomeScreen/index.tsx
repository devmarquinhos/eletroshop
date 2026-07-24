import { Image } from 'expo-image';
import { type Href, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

import { BrandLogo } from '@/components/BrandLogo';
import { Colors, EletroShopColors } from '@/constants/theme';

export function HomeScreen() {
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
            href="/api-products"
            icon="⌁"
            title="Consulta à API"
            description="Acesso direto aos dados retornados pela API."
            textColor={theme.text}
            secondaryColor={theme.textSecondary}
            cardColor={theme.backgroundElement}
          />
          <HomeAction
            href={'/local-products' as Href}
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
