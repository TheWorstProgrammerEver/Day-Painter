export const createIdFactory = () => {
  let nextId = 1

  return () => `created-${nextId++}`
}
