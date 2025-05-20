export const image2Base64 = async (image: File) => {
  const arrayBuffer = await image.arrayBuffer();
  const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  const mimeType = image.type || "image/jpeg";

  return `data:${mimeType};base64,${base64String}`;
}