import { StyleSheet } from 'react-native';

import { EletroShopColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 7,
    minHeight: 44,
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  icon: {
    color: EletroShopColors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    color: EletroShopColors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});
