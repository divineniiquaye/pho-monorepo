const SCORES = {
    CONTINUE_MATCH: 1,
    SPACE_WORD_JUMP: 0.9,
    NON_SPACE_WORD_JUMP: 0.8,
    CHARACTER_JUMP: 0.17,
    TRANSPOSITION: 0.1,
    PENALTY_SKIPPED: 0.999,
    PENALTY_CASE_MISMATCH: 0.9999,
    PENALTY_NOT_COMPLETE: 0.99,
};

const IS_GAP_REGEXP = /[\\\/_+.#"@\[\(\{&]/;
const IS_SPACE_REGEXP = /[\s-]/;

export function computeScore(
    string: string,
    abbreviation: string,
    lowerString: string,
    lowerAbbreviation: string,
    sIdx: number,
    aIdx: number,
    memo: Record<string, number>,
): number {
    if (aIdx === abbreviation.length) {
        return sIdx === string.length
            ? SCORES.CONTINUE_MATCH
            : SCORES.PENALTY_NOT_COMPLETE;
    }

    const memoKey = `${sIdx},${aIdx}`;
    if (memo[memoKey] !== undefined) return memo[memoKey];

    const abbrChar = lowerAbbreviation[aIdx];
    let index = lowerString.indexOf(abbrChar, sIdx);
    let bestScore = 0;

    while (index !== -1) {
        const nextScore = computeScore(
            string,
            abbreviation,
            lowerString,
            lowerAbbreviation,
            index + 1,
            aIdx + 1,
            memo,
        );

        let score = nextScore;

        if (index === sIdx) {
            score *= SCORES.CONTINUE_MATCH;
        } else if (IS_GAP_REGEXP.test(string[index - 1])) {
            score *=
                SCORES.NON_SPACE_WORD_JUMP *
                Math.pow(SCORES.PENALTY_SKIPPED, index - sIdx - 1);
        } else if (IS_SPACE_REGEXP.test(string[index - 1])) {
            score *=
                SCORES.SPACE_WORD_JUMP *
                Math.pow(SCORES.PENALTY_SKIPPED, index - sIdx - 1);
        } else {
            score *=
                SCORES.CHARACTER_JUMP * Math.pow(SCORES.PENALTY_SKIPPED, index - sIdx);
        }

        if (string[index] !== abbreviation[aIdx]) {
            score *= SCORES.PENALTY_CASE_MISMATCH;
        }

        if (
            score < SCORES.TRANSPOSITION &&
            lowerString[index - 1] === lowerAbbreviation[aIdx + 1]
        ) {
            const transposedScore = computeScore(
                string,
                abbreviation,
                lowerString,
                lowerAbbreviation,
                index + 1,
                aIdx + 2,
                memo,
            );
            score = Math.max(score, transposedScore * SCORES.TRANSPOSITION);
        }

        bestScore = Math.max(bestScore, score);
        index = lowerString.indexOf(abbrChar, index + 1);
    }

    memo[memoKey] = bestScore;
    return bestScore;
}

function formatInput(input: string): string {
    return input.toLowerCase().replace(/[\s-]/g, " ");
}

export function commandScore(
    string: string,
    abbreviation: string,
    aliases: string[] = [],
): number {
    const fullString = aliases.length > 0 ? `${string} ${aliases.join(" ")}` : string;
    const lowerString = formatInput(fullString);
    const lowerAbbreviation = formatInput(abbreviation);

    return computeScore(
        fullString,
        abbreviation,
        lowerString,
        lowerAbbreviation,
        0,
        0,
        {},
    );
}
