import { StyleSheet } from 'react-native';

import { EletroShopColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
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
  loadingText: { marginTop: 12 },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.7,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 7,
  },
  localNotice: {
    backgroundColor: '#FFF3E8',
    borderColor: EletroShopColors.accent,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 22,
    padding: 15,
  },
  localNoticeTitle: {
    color: '#8A3B00',
    fontSize: 14,
    fontWeight: '800',
  },
  localNoticeText: {
    color: '#8A3B00',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  errorCard: {
    backgroundColor: '#FFF0EF',
    borderColor: EletroShopColors.danger,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    padding: 13,
  },
  errorText: {
    color: EletroShopColors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  retryLink: {
    alignSelf: 'flex-start',
    marginTop: 9,
  },
  retryLinkText: {
    color: EletroShopColors.primary,
    fontWeight: '800',
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 28,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  counter: {
    fontSize: 13,
    marginTop: 3,
  },
  clearButton: {
    alignItems: 'center',
    backgroundColor: EletroShopColors.danger,
    borderRadius: 9,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 110,
    paddingHorizontal: 15,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  disabled: { opacity: 0.65 },
  separator: { height: 12 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 56,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyMessage: {
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 390,
    textAlign: 'center',
  },
  productsButton: {
    backgroundColor: EletroShopColors.primary,
    borderRadius: 9,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  productsButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
