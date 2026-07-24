import { StyleSheet } from 'react-native';

import { EletroShopColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', flexDirection: 'row' },
  symbol: { height: 94, marginRight: 4, width: 94 },
  symbolCompact: { height: 48, width: 48 },
  name: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.8,
    lineHeight: 45,
  },
  nameCompact: { fontSize: 24, letterSpacing: -1, lineHeight: 28 },
  eletro: { color: EletroShopColors.primary },
  tagline: { fontSize: 18, letterSpacing: 0.5 },
});
