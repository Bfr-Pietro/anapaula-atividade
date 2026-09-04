// ATENÇÃO: troque pelos dados da SUA conta Cloudinary.
// (Mesma ferramenta usada no Cartão de Perfil.)
// Crie um "Upload preset" do tipo "Unsigned" em Settings > Upload no painel do Cloudinary.
const CLOUD_NAME = 'SEU_CLOUD_NAME';
const UPLOAD_PRESET = 'SEU_UPLOAD_PRESET';

/**
 * Envia uma imagem (uri local do dispositivo) para o Cloudinary
 * e retorna a URL pública da foto hospedada.
 * @param {string} uri - uri local da imagem (retornada pelo expo-image-picker)
 * @returns {Promise<string>} URL segura da imagem no Cloudinary
 */
export async function uploadImageToCloudinary(uri) {
  const data = new FormData();

  data.append('file', {
    uri,
    type: 'image/jpeg',
    name: `aluno_${Date.now()}.jpg`,
  });
  data.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: data,
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.error?.message || 'Falha ao enviar imagem para o Cloudinary');
  }

  return json.secure_url;
}
