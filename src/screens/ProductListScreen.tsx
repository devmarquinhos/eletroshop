// src/screens/ProductListScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // npm install @react-native-picker/picker
import { useFocusEffect, useRouter } from 'expo-router';

import { Product } from '../types/Product';
import ProductItem from '../components/ProductItem';
import { getProducts } from '../services/productApi'; // fornecido pela Equipe 4
import { saveProductsLocally } from '../services/productStorage'; // fornecido pela Equipe 5

// Ajustem essa lista de categorias conforme o que a turma definir,
// ou substituam por algo dinâmico (ex.: extraído dos próprios produtos).
const CATEGORIAS = ['Todas', 'Áudio', 'Wearables', 'Acessórios', 'Periféricos'];

export default function ProductListScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);

  const carregarProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);

      // guarda uma cópia local para uso offline (Equipe 5)
      await saveProductsLocally(data);
    } catch (err) {
      setError('Não foi possível carregar os produtos. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect "clássico" no carregamento inicial da tela
  // useFocusEffect garante que a lista também é atualizada sempre que o
  // usuário volta para essa tela (depois de cadastrar, editar ou excluir)
  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [carregarProdutos])
  );

  const produtosFiltrados = products.filter((p) => {
    const passaCategoria = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro;
    const passaDisponibilidade = !somenteDisponiveis || p.disponivel;
    return passaCategoria && passaDisponibilidade;
  });

  const handleSelectProduct = (product: Product) => {
    // Ajustem o nome da rota conforme o arquivo criado pela Equipe 3
    // dentro de src/app (ex.: src/app/product-details.tsx)
    router.push({
      // Cast temporário: remova o "as any" quando a Equipe 3 criar o
      // arquivo de rota (ex.: src/app/product-details.tsx)
      pathname: '/product-details' as any,
      params: { productId: product.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.mensagem}>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.erro}>{error}</Text>
        <TouchableOpacity style={styles.botaoRetry} onPress={carregarProdutos}>
          <Text style={styles.botaoRetryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <Picker
          selectedValue={categoriaFiltro}
          onValueChange={(value) => setCategoriaFiltro(value)}
          style={styles.picker}
        >
          {CATEGORIAS.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>

        <View style={styles.switchRow}>
          <Text>Somente disponíveis</Text>
          <Switch value={somenteDisponiveis} onValueChange={setSomenteDisponiveis} />
        </View>
      </View>

      {products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.mensagem}>Nenhum produto cadastrado ainda.</Text>
        </View>
      ) : produtosFiltrados.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.mensagem}>
            Nenhum produto corresponde aos filtros selecionados.
          </Text>
        </View>
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductItem product={item} onPress={handleSelectProduct} />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  filtros: {
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  mensagem: {
    marginTop: 10,
    fontSize: 15,
    color: '#3A3A3C',
    textAlign: 'center',
  },
  erro: {
    fontSize: 15,
    color: '#C0392B',
    textAlign: 'center',
    marginBottom: 12,
  },
  botaoRetry: {
    backgroundColor: '#F7941D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  botaoRetryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
