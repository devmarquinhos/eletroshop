import { StyleSheet } from 'react-native';

import { EletroShopColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    marginHorizontal: 'auto',
    maxWidth: 760,
    padding: 24,
    paddingBottom: 48,
    width: '100%',
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    marginTop: 30,
  },
  titleText: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  counter: {
    marginTop: 4,
  },
  createButton: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
  localNotice: {
    backgroundColor: '#FFF3E8',
    borderColor: EletroShopColors.accent,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 12,
  },
  localNoticeText: {
    color: '#8A3B00',
    fontSize: 13,
    fontWeight: '700',
  },
  inlineError: {
    color: EletroShopColors.danger,
    marginTop: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 24,
  },
  categoryList: {
    gap: 8,
    paddingVertical: 12,
  },
  filterChip: {
    borderColor: EletroShopColors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  availabilityFilter: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: EletroShopColors.border,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    marginRight: 10,
    width: 22,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyMessage: {
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center',
  },
  errorTitle: {
    color: EletroShopColors.danger,
    fontSize: 22,
    fontWeight: '800',
  },
  errorMessage: {
    marginBottom: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});
