import { StyleSheet } from 'react-native';

import { EletroShopColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
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
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginTop: 12,
  },
  subtitle: {
    lineHeight: 21,
    marginBottom: 22,
    marginTop: 6,
  },
  inlineWarning: {
    color: '#8A3B00',
    marginBottom: 12,
  },
  form: {
    borderRadius: 16,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 14,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  inputError: {
    borderColor: EletroShopColors.danger,
    borderWidth: 1.5,
  },
  fieldError: {
    color: EletroShopColors.danger,
    fontSize: 12,
    marginTop: 5,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: { flex: 1 },
  saveButton: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 52,
  },
  retryButton: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  disabled: { opacity: 0.6 },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
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
});
