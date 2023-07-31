export const parsePgArray = (string) => {
  if (string) {
    return string.slice(1, string.length - 1).split(',')
  }
}