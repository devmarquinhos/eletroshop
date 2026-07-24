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
  backLink: {
    alignSelf: 'flex-start',
    marginTop: 18,
    paddingVertical: 8,
  },
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
  connectionCard: {
    borderRadius: 14,
    marginTop: 22,
    padding: 18,
  },
  connectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  connectionDot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  connectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  apiLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 15,
    textTransform: 'uppercase',
  },
  apiUrl: {
    fontFamily: 'monospace',
    fontSize: 14,
    marginTop: 5,
  },
  lastUpdate: {
    fontSize: 12,
    marginTop: 12,
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
  updateButton: {
    alignItems: 'center',
    borderRadius: 9,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 100,
    paddingHorizontal: 16,
  },
  buttonText: {
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
    marginTop: 7,
    textAlign: 'center',
  },
});
