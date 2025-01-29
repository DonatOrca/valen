
// TODO
// Temporary Datastoring by using sessions
// Save previously done Numerology (not quiz) results so that Numerology doesn't seem skewed.
// Similar to MySQL, index querying via hashing the names

export const hashStringToNumber = (input: String) => [...input.toLowerCase().replace(/\s+/g, '')].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) & 0xFFFFFFFF, 0) >>> 0;