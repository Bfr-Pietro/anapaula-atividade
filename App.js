import React, { useState } from 'react';
import { RoleProvider } from './src/context/RoleContext';

import PerfilAcessoScreen from './src/screens/PerfilAcessoScreen';
import ListaAlunosScreen from './src/screens/ListaAlunosScreen';
import DetalheAlunoScreen from './src/screens/DetalheAlunoScreen';
import CadastroAlunoScreen from './src/screens/CadastroAlunoScreen';

// Mapa de nome de tela -> componente.
const SCREENS = {
  PerfilAcesso: PerfilAcessoScreen,
  Lista: ListaAlunosScreen,
  Detalhe: DetalheAlunoScreen,
  Cadastro: CadastroAlunoScreen,
};

// Navegação simples baseada em pilha (stack) feita à mão, com a MESMA "forma"
// de API que o @react-navigation oferece (navigation.navigate/goBack/reset e
// route.params). Assim as telas não precisam saber que não estamos usando a
// biblioteca de navegação.
//
// Por quê não usar @react-navigation aqui? No Expo Snack, os módulos nativos
// react-native-screens e react-native-safe-area-context (dependências do
// react-navigation) costumam entrar em conflito de versão com o SDK do
// Snack e travam o app. Uma pilha simples em useState elimina esse problema
// por completo, sem exigir nenhuma dependência nativa extra.
export default function App() {
  const [stack, setStack] = useState([{ screen: 'PerfilAcesso', params: undefined }]);

  const current = stack[stack.length - 1];
  const CurrentScreen = SCREENS[current.screen];

  function navigate(screen, params) {
    setStack((prev) => [...prev, { screen, params }]);
  }

  function goBack() {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  // Aceita tanto reset('NomeDaTela') quanto o formato do react-navigation:
  // reset({ index: 0, routes: [{ name: 'Lista' }] })
  function reset(config) {
    if (typeof config === 'string') {
      setStack([{ screen: config, params: undefined }]);
      return;
    }
    if (config && Array.isArray(config.routes)) {
      const alvo = config.routes[config.index ?? config.routes.length - 1];
      setStack([{ screen: alvo.name, params: alvo.params }]);
    }
  }

  const navigation = { navigate, goBack, reset };
  const route = { params: current.params };

  return (
    <RoleProvider>
      <CurrentScreen navigation={navigation} route={route} />
    </RoleProvider>
  );
}
