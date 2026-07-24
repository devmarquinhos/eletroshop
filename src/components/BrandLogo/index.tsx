import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { styles } from './styles';

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

