import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';

export default function PerfilAcessoScreen({ navigation }) {
  const { setRole } = useRole();

  function entrarComo(perfil) {
    setRole(perfil);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Lista' }],
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Ionicons name="school" size={56} color={colors.white} />
        </View>
        <Text style={styles.title}>
          Reforça <Text style={{ color: colors.green }}>Aí</Text>
        </Text>
        <Text style={styles.tagline}>APRENDER • PRATICAR • CRESCER</Text>
      </View>

      <View style={styles.welcomeArea}>
        <Text style={styles.welcomeTitle}>Bem-vindo ao{'\n'}Reforça Aí!</Text>
        <Text style={styles.welcomeSubtitle}>
          Acompanhe a frequência, participe das atividades e evolua cada dia
          mais no seu aprendizado.
        </Text>
      </View>

      <View style={styles.buttonsArea}>
        <TouchableOpacity
          style={[styles.button, styles.buttonAluno]}
          onPress={() => entrarComo('usuario')}
        >
          <Ionicons name="person" size={20} color={colors.purple} />
          <Text style={[styles.buttonText, { color: colors.purple }]}>
            Aluno / Responsável
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonAdmin]}
          onPress={() => entrarComo('admin')}
        >
          <Ionicons name="shield-checkmark" size={20} color={colors.white} />
          <Text style={[styles.buttonText, { color: colors.white }]}>
            Administrador
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logoArea: {
    alignItems: 'center',
    marginTop: 24,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.white,
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textSecondary,
  },
  welcomeArea: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#B9BEDC',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  buttonsArea: {
    gap: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonAluno: {
    backgroundColor: colors.white,
  },
  buttonAdmin: {
    backgroundColor: colors.green,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
