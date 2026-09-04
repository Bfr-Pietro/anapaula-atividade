import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';
import { escutarAluno, excluirAluno } from '../services/alunosService';

function LinhaInfo({ icone, label, valor }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icone} size={18} color={colors.purple} />
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{valor || '-'}</Text>
      </View>
    </View>
  );
}

function BarraFrequencia({ valor }) {
  const percentual = Math.max(0, Math.min(100, Number(valor) || 0));
  return (
    <View>
      <View style={styles.freqLabelRow}>
        <Text style={styles.freqLabel}>Frequência</Text>
        <Text style={styles.freqValor}>{percentual}%</Text>
      </View>
      <View style={styles.freqTrack}>
        <View style={[styles.freqFill, { width: `${percentual}%` }]} />
      </View>
    </View>
  );
}

export default function DetalheAlunoScreen({ route, navigation }) {
  const { alunoId } = route.params;
  const { isAdmin } = useRole();

  const [aluno, setAluno] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = escutarAluno(
      alunoId,
      (dados) => {
        setAluno(dados);
        setCarregando(false);
      },
      (erro) => {
        setCarregando(false);
        Alert.alert('Erro ao carregar aluno', erro.message);
      }
    );
    return unsubscribe;
  }, [alunoId]);

  function confirmarExclusao() {
    Alert.alert(
      'Excluir aluno',
      `Tem certeza que deseja excluir "${aluno.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirAluno(alunoId);
              Alert.alert('Pronto', 'Aluno excluído com sucesso.');
              navigation.goBack();
            } catch (erro) {
              Alert.alert('Erro ao excluir', erro.message);
            }
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.centerArea]}>
        <ActivityIndicator size="large" color={colors.purple} />
        <Text style={styles.loadingText}>Carregando dados do aluno...</Text>
      </SafeAreaView>
    );
  }

  if (!aluno) {
    return (
      <SafeAreaView style={[styles.container, styles.centerArea]}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.textSecondary} />
        <Text style={styles.loadingText}>Este aluno não existe mais.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.purple, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>

          {aluno.fotoURL ? (
            <Image source={{ uri: aluno.fotoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarLetter}>
                {aluno.nome?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.nome}>{aluno.nome}</Text>
          <Text style={styles.serie}>{aluno.serie}</Text>
        </View>

        <View style={styles.card}>
          <LinhaInfo icone="school-outline" label="Série" valor={aluno.serie} />
          <LinhaInfo icone="person-outline" label="Responsável" valor={aluno.responsavel} />
          <LinhaInfo icone="rocket-outline" label="Projeto" valor="Reforça Aí" />
        </View>

        <View style={styles.card}>
          <BarraFrequencia valor={aluno.frequencia} />
        </View>

        {isAdmin && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => navigation.navigate('Cadastro', { aluno })}
            >
              <Ionicons name="pencil" size={18} color={colors.white} />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={confirmarExclusao}
            >
              <Ionicons name="trash" size={18} color={colors.white} />
              <Text style={styles.actionButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerArea: { alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { color: colors.textSecondary, fontSize: 13 },
  header: {
    backgroundColor: colors.purple,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 12,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: colors.white },
  avatarPlaceholder: {
    backgroundColor: colors.purpleDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { color: colors.white, fontWeight: '700', fontSize: 32 },
  nome: { color: colors.white, fontSize: 19, fontWeight: '800', marginTop: 10 },
  serie: { color: '#E7E4FF', fontSize: 13, marginTop: 2 },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: 11, color: colors.textSecondary },
  infoValor: { fontSize: 14, color: colors.textPrimary, fontWeight: '600', marginTop: 1 },
  freqLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  freqLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  freqValor: { fontSize: 13, color: colors.green, fontWeight: '700' },
  freqTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.greenLight,
    overflow: 'hidden',
  },
  freqFill: { height: '100%', backgroundColor: colors.green, borderRadius: 4 },
  actionsRow: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 20 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  editButton: { backgroundColor: colors.blue },
  deleteButton: { backgroundColor: colors.red },
  actionButtonText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
