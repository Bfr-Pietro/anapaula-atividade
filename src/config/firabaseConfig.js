// IMPORTANTE: usamos o Firebase v8 (API "compat" / namespaced) de propósito.
// O Firebase v9+ (modular) usa o campo "exports" do package.json, que o
// bundler do Expo Snack (Snackager) não resolve direito — isso trava o app
// com erro de dependência ao tentar importar 'firebase/app' ou 'firebase/firestore'.
// A v8 não usa "exports" e funciona perfeitamente no Snack.
import firebase from 'firebase/app';
import 'firebase/firestore';

// Configuração do projeto Firebase "nuvem2-juliano"
const firebaseConfig = {
  apiKey: 'AIzaSyAHA5-2gLuEaW-yE5u3sReYIUr_msS-xSc',
  authDomain: 'nuvem2-juliano.firebaseapp.com',
  projectId: 'nuvem2-juliano',
  storageBucket: 'nuvem2-juliano.firebasestorage.app',
  messagingSenderId: '38462146013',
  appId: '1:38462146013:web:30a74878d3c2bd34be6234',
  measurementId: 'G-T4GXBSFRZX',
};

// Evita inicializar o app duas vezes (importante no Snack, que recarrega o bundle)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export default firebase;
