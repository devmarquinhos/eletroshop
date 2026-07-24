import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

import { BrandLogo } from '@/components/BrandLogo';
import { Colors, EletroShopColors } from '@/constants/theme';
import { getProductById, updateProduct } from '@/services/productApi';
import { loadProductsLocally } from '@/services/productStorage';
import type { Product } from '@/types/product';
import {
  type ProductFormErrors,
  validateProductForm,
} from '@/utils/productValidation';

export function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const accent =
    scheme === 'dark' ? EletroShopColors.darkAccent : EletroShopColors.accent;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fillForm = useCallback((product: Product) => {
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setPrice(String(product.price).replace('.', ','));
    setQuantity(String(product.quantity));
  }, []);

  const loadProduct = useCallback(async () => {
    if (!id) {
      setLoadError('Identificador do produto não informado.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError(null);
      fillForm(await getProductById(id));
    } catch (apiError) {
      try {
        const localProduct = (await loadProductsLocally()).find(
          (product) => product.id === id,
        );

        if (localProduct) {
          fillForm(localProduct);
          setLoadError(
            'A API está indisponível. Você está editando a última versão salva.',
          );
          return;
        }
      } catch {
        // Mantém a mensagem original da API.
      }

      setLoadError(
        apiError instanceof Error
          ? apiError.message
          : 'Não foi possível carregar o produto.',
      );
    } finally {
      setLoading(false);
    }
  }, [fillForm, id]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  async function handleSave() {
    if (!id || saving) return;

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
      setSaving(true);
      setErrors({});
      await updateProduct(id, validation.data);

      Alert.alert('Produto atualizado', 'As alterações foram salvas com sucesso.', [
        {
          text: 'OK',
          onPress: () =>
            router.replace({
              pathname: '/products/[id]',
              params: { id },
            }),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Não foi possível atualizar',
        error instanceof Error
          ? error.message
          : 'Verifique a conexão e tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={EletroShopColors.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Carregando produto...
        </Text>
      </View>
    );
  }

  if (!name && loadError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorTitle}>Não foi possível editar</Text>
        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
          {loadError}
        </Text>
        <Pressable
          onPress={() => void loadProduct()}
          style={[styles.retryButton, { backgroundColor: EletroShopColors.primary }]}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: EletroShopColors.primary }}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.background,
      borderColor: EletroShopColors.border,
      color: theme.text,
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <BrandLogo compact textColor={theme.text} />
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={{ color: EletroShopColors.primary }}>← Cancelar edição</Text>
          </Pressable>

          <Text style={[styles.title, { color: theme.text }]}>Editar produto</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Atualize as informações do produto. A disponibilidade será recalculada
            pela API.
          </Text>

          {loadError && <Text style={styles.inlineWarning}>{loadError}</Text>}

          <View style={[styles.form, { backgroundColor: theme.backgroundElement }]}>
            <FieldLabel text="Nome do produto *" color={theme.text} />
            <TextInput
              value={name}
              onChangeText={(value) => {
                setName(value);
                setErrors((current) => ({ ...current, name: undefined }));
              }}
              placeholder="Ex.: Notebook Gamer"
              placeholderTextColor={theme.textSecondary}
              style={[inputStyle, errors.name && styles.inputError]}
              editable={!saving}
            />
            <ErrorText message={errors.name} />

            <FieldLabel text="Descrição *" color={theme.text} />
            <TextInput
              value={description}
              onChangeText={(value) => {
                setDescription(value);
                setErrors((current) => ({
                  ...current,
                  description: undefined,
                }));
              }}
              placeholder="Características e especificações"
              placeholderTextColor={theme.textSecondary}
              style={[
                inputStyle,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              multiline
              numberOfLines={4}
              editable={!saving}
            />
            <ErrorText message={errors.description} />

            <FieldLabel text="Categoria *" color={theme.text} />
            <TextInput
              value={category}
              onChangeText={(value) => {
                setCategory(value);
                setErrors((current) => ({
                  ...current,
                  category: undefined,
                }));
              }}
              placeholder="Ex.: Informática"
              placeholderTextColor={theme.textSecondary}
              style={[inputStyle, errors.category && styles.inputError]}
              editable={!saving}
            />
            <ErrorText message={errors.category} />

            <View style={styles.row}>
              <View style={styles.column}>
                <FieldLabel text="Preço (R$) *" color={theme.text} />
                <TextInput
                  value={price}
                  onChangeText={(value) => {
                    setPrice(value);
                    setErrors((current) => ({ ...current, price: undefined }));
                  }}
                  placeholder="0,00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                  style={[inputStyle, errors.price && styles.inputError]}
                  editable={!saving}
                />
                <ErrorText message={errors.price} />
              </View>

              <View style={styles.column}>
                <FieldLabel text="Quantidade *" color={theme.text} />
                <TextInput
                  value={quantity}
                  onChangeText={(value) => {
                    setQuantity(value);
                    setErrors((current) => ({ ...current, quantity: undefined }));
                  }}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  style={[inputStyle, errors.quantity && styles.inputError]}
                  editable={!saving}
                />
                <ErrorText message={errors.quantity} />
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={() => void handleSave()}
              style={[
                styles.saveButton,
                { backgroundColor: accent },
                saving && styles.disabled,
              ]}>
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Salvar alterações</Text>
              )}
            </Pressable>
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
  return message ? <Text style={styles.fieldError}>{message}</Text> : null;
}
