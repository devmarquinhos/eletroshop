import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, EletroShopColors } from '@/constants/theme';
import { BrandLogo } from '@/components/brand-logo';
import { createProduct } from '@/services/productApi';

type FormErrors = Partial<Record<'name' | 'price' | 'quantity', string>>;

function parsePrice(value: string) {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseQuantity(value: string) {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export default function CreateProductScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const accent = scheme === 'dark' ? EletroShopColors.darkAccent : EletroShopColors.accent;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors: FormErrors = {};
    const parsedPrice = parsePrice(price);
    const parsedQuantity = parseQuantity(quantity);

    if (!name.trim()) nextErrors.name = 'Informe o nome do produto.';
    if (!price.trim()) nextErrors.price = 'Informe o preço do produto.';
    else if (parsedPrice === null) nextErrors.price = 'Use um preço igual ou maior que zero, com até 2 casas decimais.';
    if (parsedQuantity === null) nextErrors.quantity = 'Use um número inteiro igual ou maior que zero.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || parsedPrice === null || parsedQuantity === null) {
      return null;
    }

    return { parsedPrice, parsedQuantity };
  }

  function clearForm() {
    setName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('0');
    setErrors({});
  }

  async function handleRegister() {
    if (loading) return;

    const values = validate();
    if (!values) return;

    try {
      setLoading(true);
      await createProduct({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: values.parsedPrice,
        quantity: values.parsedQuantity,
      });

      clearForm();
      Alert.alert('Produto cadastrado', 'O produto foi salvo com sucesso.', [
        {
          text: 'OK',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
              return;
            }

            router.replace('/');
          },
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Verifique a conexão e tente novamente.';
      Alert.alert('Não foi possível cadastrar', message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = [styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: EletroShopColors.border }];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <BrandLogo compact textColor={theme.text} />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>Cadastrar produto</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Adicione um novo item ao catálogo da loja.</Text>

          <View style={[styles.form, { backgroundColor: theme.backgroundElement }]}>
            <FieldLabel text="Nome do produto *" color={theme.text} />
            <TextInput
              style={[inputStyle, errors.name && styles.inputError]}
              placeholder="Ex.: Notebook Gamer"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={(value) => { setName(value); setErrors((current) => ({ ...current, name: undefined })); }}
              autoCapitalize="sentences"
              returnKeyType="next"
              editable={!loading}
            />
            <ErrorText message={errors.name} />

            <FieldLabel text="Descrição" color={theme.text} />
            <TextInput
              style={[inputStyle, styles.textArea]}
              placeholder="Características e especificações"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              editable={!loading}
            />

            <FieldLabel text="Categoria" color={theme.text} />
            <TextInput
              style={inputStyle}
              placeholder="Ex.: Informática"
              placeholderTextColor={theme.textSecondary}
              value={category}
              onChangeText={setCategory}
              autoCapitalize="words"
              editable={!loading}
            />

            <View style={styles.row}>
              <View style={styles.column}>
                <FieldLabel text="Preço (R$) *" color={theme.text} />
                <TextInput
                  style={[inputStyle, errors.price && styles.inputError]}
                  placeholder="0,00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={(value) => { setPrice(value); setErrors((current) => ({ ...current, price: undefined })); }}
                  editable={!loading}
                />
                <ErrorText message={errors.price} />
              </View>

              <View style={styles.column}>
                <FieldLabel text="Quantidade *" color={theme.text} />
                <TextInput
                  style={[inputStyle, errors.quantity && styles.inputError]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  value={quantity}
                  onChangeText={(value) => { setQuantity(value); setErrors((current) => ({ ...current, quantity: undefined })); }}
                  editable={!loading}
                />
                <ErrorText message={errors.quantity} />
              </View>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Cadastrar produto"
              activeOpacity={0.85}
              style={[styles.button, { backgroundColor: accent }, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Cadastrar produto</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({ text, color }: { text: string; color: string }) {
  return <Text style={[styles.label, { color }]}>{text}</Text>;
}

function ErrorText({ message }: { message?: string }) {
  return message ? <Text style={styles.errorText}>{message}</Text> : null;
}

const styles = StyleSheet.create({
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
