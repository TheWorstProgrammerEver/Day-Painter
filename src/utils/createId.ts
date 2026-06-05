type RandomBytes = Uint8Array<ArrayBuffer>

type IdCrypto = {
  getRandomValues?: (values: RandomBytes) => RandomBytes
  randomUUID?: () => string
}

const toHex = (value: number) => value.toString(16).padStart(2, '0')

const formatUuid = (bytes: Uint8Array) => {
  const hex = Array.from(bytes, toHex)

  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join('')
  ].join('-')
}

const createUuidFromRandomValues = (cryptoSource: IdCrypto) => {
  const bytes = new Uint8Array(16)
  cryptoSource.getRandomValues?.(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  return formatUuid(bytes)
}

const createFallbackId = () => [
  'id',
  Date.now().toString(36),
  Math.random().toString(36).slice(2)
].join('-')

const getDefaultCrypto = (): IdCrypto | undefined => {
  const cryptoSource = globalThis.crypto as Crypto | undefined

  if (!cryptoSource) {
    return undefined
  }

  return {
    getRandomValues: (values) => cryptoSource.getRandomValues(values),
    randomUUID: () => cryptoSource.randomUUID()
  }
}

export const createId = (cryptoSource = getDefaultCrypto()) => {
  try {
    const id = cryptoSource?.randomUUID?.()

    if (id) {
      return id
    }
  } catch {
    // Some browsers expose crypto differently across secure and insecure contexts.
  }

  if (cryptoSource?.getRandomValues) {
    return createUuidFromRandomValues(cryptoSource)
  }

  return createFallbackId()
}
