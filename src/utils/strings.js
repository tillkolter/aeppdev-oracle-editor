
const MAX_LENGTH = 25

export const truncate = (str) => {
  if (str.length > MAX_LENGTH) {
    let prefix = str.substring(0, 8)
    let suffix = str.substring(MAX_LENGTH - 9, MAX_LENGTH - 1)
    return `${prefix}...${suffix}`
  }
  return str
}
