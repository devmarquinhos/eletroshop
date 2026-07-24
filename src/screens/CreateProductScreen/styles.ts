import { Platform, StyleSheet } from 'react-native';

import { EletroShopColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContainer: { padding: 24, paddingBottom: 48 },
  brandRow: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { fontSize: 15, marginTop: 6, marginBottom: 24 },
  form: {
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(26, 29, 41, 0.08)' },
      default: {
        shadowColor: '#1A1D29',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      },
    }),
  },
  label: { fontSize: 14, fontWeight: '700', marginTop: 14, marginBottom: 7 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 16 },
  inputError: { borderColor: EletroShopColors.danger, borderWidth: 1.5 },
  errorText: { color: EletroShopColors.danger, fontSize: 12, marginTop: 5 },
  textArea: { minHeight: 96, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  column: { flex: 1 },
  button: { minHeight: 52, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 28 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
