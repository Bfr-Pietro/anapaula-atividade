import firebase, { db } from '../config/firebaseConfig';

// Coleção do projeto no Firestore.
// Documentos com os campos: nome, serie, frequencia, responsavel (+ fotoURL,
// usada para a foto hospedada no Cloudinary).
const ALUNOS_COLLECTION = 'alunos_projeto';

/**
 * Escuta em tempo real a lista de alunos, ordenada por nome.
 * Retorna a função de "unsubscribe" para ser usada no cleanup do useEffect.
 */
export function escutarAlunos(onChange, onError) {
  return db
    .collection(ALUNOS_COLLECTION)
    .orderBy('nome', 'asc')
    .onSnapshot((snapshot) => {
      const lista = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onChange(lista);
    }, onError);
}

/** Escuta em tempo real um único aluno pelo id (usado na tela de Detalhe). */
export function escutarAluno(id, onChange, onError) {
  return db
    .collection(ALUNOS_COLLECTION)
    .doc(id)
    .onSnapshot((docSnap) => {
      if (docSnap.exists) {
        onChange({ id: docSnap.id, ...docSnap.data() });
      } else {
        onChange(null);
      }
    }, onError);
}

/** Cria um novo aluno na coleção. */
export async function criarAluno(dadosAluno) {
  return db.collection(ALUNOS_COLLECTION).add({
    ...dadosAluno,
    criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

/** Atualiza um aluno existente. */
export async function atualizarAluno(id, dadosAluno) {
  return db
    .collection(ALUNOS_COLLECTION)
    .doc(id)
    .update({
      ...dadosAluno,
      atualizadoEm: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

/** Remove um aluno da coleção. */
export async function excluirAluno(id) {
  return db.collection(ALUNOS_COLLECTION).doc(id).delete();
}
