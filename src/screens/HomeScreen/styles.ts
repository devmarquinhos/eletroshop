import { StyleSheet } from 'react-native';

import { EletroShopColors } from '@/constants/theme';

export const styles = StyleSheet.create({
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
