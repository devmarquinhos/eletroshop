import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

import { Colors, EletroShopColors } from '@/constants/theme';
import { BrandLogo } from '@/components/BrandLogo';
import { createProduct } from '@/services/productApi';
import {
  ProductFormErrors,
  validateProductForm,
} from '@/utils/productValidation';

export function CreateProductScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const accent = scheme === 'dark' ? EletroShopColors.darkAccent : EletroShopColors.accent;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [loading, setLoading] = useState(false);

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

    const validation = validateProductForm({
      name,
      description,
      category,
      price,
      quantity,
    });

    if (!validation.data) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      await createProduct(validation.data);

      clearForm();
      Alert.alert('Produto cadastrado', 'O produto foi salvo com sucesso.', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/products');
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

            <FieldLabel text="Descrição *" color={theme.text} />
            <TextInput
              style={[
                inputStyle,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              placeholder="Características e especificações"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={(value) => {
                setDescription(value);
                setErrors((current) => ({
                  ...current,
                  description: undefined,
                }));
              }}
              editable={!loading}
            />
            <ErrorText message={errors.description} />

            <FieldLabel text="Categoria *" color={theme.text} />
            <TextInput
              style={[inputStyle, errors.category && styles.inputError]}
              placeholder="Ex.: Informática"
              placeholderTextColor={theme.textSecondary}
              value={category}
              onChangeText={(value) => {
                setCategory(value);
                setErrors((current) => ({
                  ...current,
                  category: undefined,
                }));
              }}
              autoCapitalize="words"
              editable={!loading}
            />
            <ErrorText message={errors.category} />

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
