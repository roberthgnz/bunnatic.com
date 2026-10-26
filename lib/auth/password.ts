import { compare } from 'bcryptjs'
const iterations = 100_000
const hex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0')
  ).join('')
export async function hashToken(token: string) {
  return hex(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  )
}
async function derive(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  rounds: number
) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  return hex(
    await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: rounds },
      key,
      256
    )
  )
}
export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return `pbkdf2$${iterations}$${hex(salt.buffer)}$${await derive(password, salt, iterations)}`
}
export async function verifyPassword(password: string, stored: string) {
  if (/^\$2[aby]\$/.test(stored))
    return compare(password, stored.replace(/^\$2y\$/, '$2b$'))
  const [algorithm, rounds, salt, expected] = stored.split('$')
  if (
    algorithm !== 'pbkdf2' ||
    !/^\d+$/.test(rounds) ||
    Number(rounds) > iterations ||
    !/^[a-f0-9]{32}$/.test(salt) ||
    !/^[a-f0-9]{64}$/.test(expected)
  )
    return false
  const actual = await derive(
    password,
    Uint8Array.from(salt.match(/../g)!, (b) => parseInt(b, 16)),
    Number(rounds)
  )
  let difference = 0
  for (let i = 0; i < actual.length; i++)
    difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i)
  return difference === 0
}
