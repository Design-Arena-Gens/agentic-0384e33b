export function nanoid(size = 12): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';
  const array = new Uint8Array(size);
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < size; i++) array[i] = Math.floor(Math.random() * 256);
  }
  let id = '';
  for (let i = 0; i < size; i++) id += alphabet[array[i] % alphabet.length];
  return id;
}
