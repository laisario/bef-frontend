export function capitalizeFirstLetter(str) {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
}

export function truncateString(str, num) {
  if (num === null) {
    return str
  }
  if (str?.length > num) {
    return `${str.slice(0, num)}...`
  }
  return str;
}
