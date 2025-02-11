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

// vibratonal score 1st, numerology score 2nd, vowels 3rd
export const get_numerology = (name: String): [number, number, number] => {
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
    return [(total_numerology * total_vowels) / name.length, total_numerology, total_vowels]
}

export const get_total_numerology_score = (firstName: string, secondName: string) => {
    const [_, firstScore, firstTotalVowels] = get_numerology(firstName);
    const [__, secondScore, secondTotalVowels] = get_numerology(secondName);
    const rawTotal = firstScore + secondScore;

    const maxNameLength = Math.max(firstName.length, secondName.length);
    const maxVowelCount = Math.max(firstTotalVowels, secondTotalVowels);
    const maxPossibleScore = weight * maxVowelCount * maxNameLength;

    const percentage = Math.min((rawTotal / maxPossibleScore) * 100, 100);
    return Math.round(percentage);
};

export default Numerology;