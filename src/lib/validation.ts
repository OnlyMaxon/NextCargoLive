export const validateFINCode = (fin: string): boolean => {
  if (!fin || fin.length !== 7) return false
  
  const pattern = /^[A-Z0-9]{7}$/i
  return pattern.test(fin)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2
}
