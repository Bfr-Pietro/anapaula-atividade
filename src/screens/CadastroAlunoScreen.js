import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { criarAluno, atualizarAluno } from '../services/alunosService';

function Campo({ label, ...props }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
    </View>
  );
}

export default function CadastroAlunoScreen({ route, navigation }) {
  const alunoExistente = route.params?.aluno;
  const modoEdicao = !!alunoExistente;

  const [nome, setNome] = useState(alunoExistente?.nome ?? '');
  const [serie, setSerie] = useState(alunoExistente?.serie ?? '');
  const [responsavel, setResponsavel] = useState(alunoExistente?.responsavel ?? '');
  const [frequencia, setFrequencia] = useState(
    alunoExistente?.frequencia != null ? String(alunoExistente.frequencia) : ''
  );
  const [fotoUri, setFotoUri] = useState(alunoExistente?.fotoURL ?? null);
  const [novaFotoLocal, setNovaFotoLocal] = useState(false);

  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos acessar suas fotos para continuar.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setFotoUri(resultado.assets[0].uri);
      setNovaFotoLocal(true);
    }
  }

  function validarCampos() {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do aluno.');
      return false;
    }
    if (!serie.trim()) {
      Alert.alert('Campo obrigatório', 'Informe a série do aluno.');
      return false;
    }
    if (!responsavel.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do responsável.');
      return false;
    }
    return true;
  }

  async function salvar() {
    if (!validarCampos()) return;

    setSalvando(true);
    try {
      let fotoURL = alunoExistente?.fotoURL ?? null;

      // Só faz upload no Cloudinary se o usuário escolheu uma foto nova
      if (novaFotoLocal && fotoUri) {
        setEnviandoImagem(true);
        fotoURL = await uploadImageToCloudinary(fotoUri);
        setEnviandoImagem(false);
      }

      const dados = {
        nome: nome.trim(),
        serie: serie.trim(),
        responsavel: responsavel.trim(),
        frequencia: Number(frequencia) || 0,
        fotoURL,
      };

      if (modoEdicao) {
        await atualizarAluno(alunoExistente.id, dados);
        Alert.alert('Atualizado', 'Aluno atualizado com sucesso!');
      } else {
        await criarAluno(dados);
        Alert.alert('Cadastrado', 'Aluno cadastrado com sucesso!');
      }

      navigation.goBack();
    } catch (erro) {
      Alert.alert('Erro ao salvar', erro.message);
    } finally {
      setSalvando(false);
      setEnviandoImagem(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {modoEdicao ? 'Editar aluno' : 'Novo aluno'}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity style={styles.fotoArea} onPress={escolherFoto}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
          ) : (
            <View style={[styles.fotoPreview, styles.fotoPlaceholder]}>
              <Ionicons name="camera" size={26} color={colors.purple} />
            </View>
          )}
          <Text style={styles.fotoTexto}>
            {enviandoImagem ? 'Enviando foto...' : 'Toque para escolher uma foto'}
          </Text>
          {enviandoImagem && (
            <ActivityIndicator size="small" color={colors.purple} style={{ marginTop: 6 }} />
          )}
        </TouchableOpacity>

        <Campo
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Ana Clara Silva"
        />
        <Campo
          label="Série"
          value={serie}
          onChangeText={setSerie}
          placeholder="Ex: 6º ano"
        />
        <Campo
          label="Responsável"
          value={responsavel}
          onChangeText={setResponsavel}
          placeholder="Nome do responsável"
        />
        <Campo
          label="Frequência (%)"
          value={frequencia}
          onChangeText={setFrequencia}
          placeholder="Ex: 92"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.salvarButton, salvando && { opacity: 0.7 }]}
          onPress={salvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.salvarButtonText}>
                {modoEdicao ? 'Salvar alterações' : 'Cadastrar aluno'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  fotoArea: { alignItems: 'center', marginBottom: 20 },
  fotoPreview: { width: 90, height: 90, borderRadius: 45 },
  fotoPlaceholder: {
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoTexto: { marginTop: 8, fontSize: 12, color: colors.textSecondary },
  label: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  salvarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.green,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  salvarButtonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
