import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { EletroShopColors } from '@/constants/theme';

type BrandLogoProps = {
  compact?: boolean;
  textColor: string;
};

export function BrandLogo({ compact = false, textColor }: BrandLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/brand/eos-symbol.png')}
        style={[styles.symbol, compact && styles.symbolCompact]}
        contentFit="contain"
      />
      <View>
        <Text style={[styles.name, compact && styles.nameCompact]}>
          <Text style={styles.eletro}>Eletro</Text>
          <Text style={{ color: textColor }}>shop</Text>
        </Text>
        {!compact && <Text style={[styles.tagline, { color: textColor }]}>Seu Mundo Eletrônico.</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flexDirection: 'row' },
  symbol: { height: 94, marginRight: 4, width: 94 },
  symbolCompact: { height: 48, width: 48 },
  name: { fontSize: 42, fontWeight: '800', letterSpacing: -1.8, lineHeight: 45 },
  nameCompact: { fontSize: 24, letterSpacing: -1, lineHeight: 28 },
  eletro: { color: EletroShopColors.primary },
  tagline: { fontSize: 18, letterSpacing: 0.5 },
});
