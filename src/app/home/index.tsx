import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definição das rotas para tipagem da navegação do React Navigation
type RootStackParamList = {
  CreateProduct: undefined;
  ProductList: undefined; // Tela de destino acordada com as outras equipes
};

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProduct'>;

export default function CreateProductScreen({ navigation }: Props) {
  // 1. Estados controlados com useState para o formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Função de validação e submissão dos dados
  const handleRegister = async () => {
    // Validação de campos obrigatórios (Nome e Preço)
    if (!name.trim()) {
      Alert.alert('Erro de Validação', 'O nome do produto é obrigatório.');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Erro de Validação', 'O preço do produto é obrigatório.');
      return;
    }

    // Tratamento e conversão do Preço (String -> Number)
    const formattedPrice = price.replace(',', '.');
    const parsedPrice = parseFloat(formattedPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Erro de Validação', 'Insira um preço válido e maior que zero (Ex: 29.90).');
      return;
    }

    // Tratamento e conversão da Quantidade (String -> Number)
    const parsedQuantity = parseInt(quantity, 10);
    if (quantity.trim() !== '' && (isNaN(parsedQuantity) || parsedQuantity < 0)) {
      Alert.alert('Erro de Validação', 'A quantidade deve ser um número inteiro maior ou igual a zero.');
      return;
    }

    // Define 0 se o campo quantidade for enviado em branco
    const finalQuantity = quantity.trim() === '' ? 0 : parsedQuantity;

    // Estrutura do payload pronto para a API
    const productData = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: parsedPrice,
      quantity: finalQuantity,
    };

    try {
      setLoading(true);

      // 3. Integração com a API (Exemplo com fetch - adapte para o Axios ou serviço da Equipe 4)
      /*
      const response = await fetch('https://api-sua-loja.com/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) throw new Error('Falha no servidor');
      */

      // Simulando o tempo de resposta da API
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // 4. Mensagem de confirmação de sucesso
      Alert.alert('Sucesso!', 'Produto cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            // 5. Limpeza dos campos do formulário
            setName('');
            setDescription('');
            setCategory('');
            setPrice('');
            setQuantity('');

            // 6. Integração com a navegação: Redireciona para a listagem
            navigation.navigate('ProductList');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível cadastrar o produto na API externa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Novo Produto</Text>
        <Text style={styles.subtitle}>Preencha as informações para cadastrar o item no estoque.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do Produto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Camiseta Algodão Premium"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva detalhes como tamanho, cor ou especificações"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Categoria</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Vestuário, Eletrônicos"
            placeholderTextColor="#999"
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Preço (R$) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Qtd. em Estoque</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar Produto</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343A40',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#212529',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  buttonDisabled: {
    backgroundColor: '#A2C8F5',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});