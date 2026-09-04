import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';
import { escutarAlunos, excluirAluno } from '../services/alunosService';

export default function ListaAlunosScreen({ navigation }) {
  const { isAdmin, setRole } = useRole();

  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  // Firestore Read em tempo real
  useEffect(() => {
    const unsubscribe = escutarAlunos(
      (lista) => {
        setAlunos(lista);
        setCarregando(false);
      },
      (erro) => {
        setCarregando(false);
        Alert.alert('Erro ao carregar', erro.message);
      }
    );

    return unsubscribe;
  }, []);

  const alunosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return alunos.filter(
      (aluno) =>
        aluno.nome?.toLowerCase().includes(termo) ||
        aluno.serie?.toLowerCase().includes(termo)
    );
  }, [alunos, busca]);

  function confirmarExclusao(aluno) {
    Alert.alert(
      'Excluir aluno',
      `Tem certeza que deseja excluir "${aluno.nome}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirAluno(aluno.id);
              Alert.alert('Pronto', 'Aluno excluído com sucesso.');
            } catch (erro) {
              Alert.alert('Erro ao excluir', erro.message);
            }
          },
        },
      ]
    );
  }

  function sair() {
    setRole(null);
    navigation.reset({ index: 0, routes: [{ name: 'PerfilAcesso' }] });
  }

  function renderAluno({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detalhe', { alunoId: item.id })}
      >
        {item.fotoURL ? (
          <Image source={{ uri: item.fotoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarLetter}>
              {item.nome?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <Text style={styles.cardSerie}>{item.serie}</Text>
        </View>

        <View style={styles.freqBadge}>
          <Text style={styles.freqBadgeText}>{item.frequencia ?? 0}%</Text>
        </View>

        {isAdmin && (
          <View style={styles.adminActions}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Cadastro', { aluno: item })
              }
              style={styles.iconButton}
            >
              <Ionicons name="pencil" size={18} color={colors.blue} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmarExclusao(item)}
              style={styles.iconButton}
            >
              <Ionicons name="trash" size={18} color={colors.red} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alunos</Text>
        <TouchableOpacity onPress={sair}>
          <Ionicons name="log-out-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou série..."
          placeholderTextColor={colors.textSecondary}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {carregando ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color={colors.purple} />
          <Text style={styles.loadingText}>Buscando alunos no Firestore...</Text>
        </View>
      ) : alunosFiltrados.length === 0 ? (
        <View style={styles.loadingArea}>
          <Ionicons name="people-outline" size={40} color={colors.textSecondary} />
          <Text style={styles.loadingText}>Nenhum aluno encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={alunosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderAluno}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 100 }}
        />
      )}

      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Ionicons name="add" size={26} color={colors.white} />
          <Text style={styles.fabText}>Novo registro</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  loadingArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: { color: colors.textSecondary, fontSize: 13 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarPlaceholder: {
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { color: colors.white, fontWeight: '700', fontSize: 18 },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSerie: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  freqBadge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  freqBadgeText: { color: colors.green, fontWeight: '700', fontSize: 12 },
  adminActions: { flexDirection: 'row', marginLeft: 8, gap: 4 },
  iconButton: { padding: 6 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.purple,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
