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
  successNotice: {
    backgroundColor: '#E9F9EF',
    borderColor: EletroShopColors.success,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 16,
    padding: 12,
  },
  successNoticeText: {
    color: '#087A37',
    fontSize: 13,
    fontWeight: '800',
  },
  localNotice: {
    backgroundColor: '#FFF3E8',
    borderColor: EletroShopColors.accent,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 16,
    padding: 12,
  },
  localNoticeText: {
    color: '#8A3B00',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    marginTop: 18,
    padding: 24,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  titleContent: { flex: 1 },
  category: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginTop: 5,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  price: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 24,
    marginTop: 20,
  },
  detailRow: {
    borderTopColor: EletroShopColors.border,
    borderTopWidth: 1,
    paddingVertical: 15,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  descriptionSection: {
    borderTopColor: EletroShopColors.border,
    borderTopWidth: 1,
    paddingTop: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  editButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 16,
  },
  deleteButton: {
    alignItems: 'center',
    borderColor: EletroShopColors.danger,
    borderRadius: 10,
    borderWidth: 1.5,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: EletroShopColors.danger,
    fontWeight: '800',
  },
  disabled: { opacity: 0.6 },
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
  primaryButton: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
