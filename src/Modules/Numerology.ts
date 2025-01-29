const Numerology = new Map<String, number>();
const numerology_pattern = "abcdefghijklmnopqrstuvwxyz";
const vowels_pattern = 'aeiou';
const weight = 9;

for (let i = 0; i < numerology_pattern.length; i++) {
    Numerology.set(numerology_pattern.charAt(i), (i % weight) + 1);
}

const modify_name = (name: String) => name.toLowerCase().replace(/\s+/g, '');

// TODO
// Should we add 'shifting'? Y'know, the ones from like Vignere Ciphers

export const get_numerology = (name: String) => {
    name = modify_name(name);
    let total_numerology = 0;
    for (const char of name) {
        if (Numerology.has(char)) {
            total_numerology += Numerology.get(char)!;
        }
    }
    let total_vowels = 0;
    for (const char of name) {
        if (vowels_pattern.includes(char)) total_vowels++
    }
    return (total_numerology * total_vowels) / name.length
}

export default Numerology;