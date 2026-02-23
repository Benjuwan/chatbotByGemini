/**
 * [プロンプトインジェクション3層防御 — AIエージェント時代のセキュリティ実践](https://qiita.com/kenimo49/items/45e64e43fe623fcbe1dd)を参考に生成
 * この関数だけでは限界があるので記事にもあるように、Layer 2, Layer 3 での対応が必要 
*/

// 検出結果の型
export type DetectionResult = {
    isInjection: boolean;
    matchedPatterns: MatchedPattern[];
    normalizedInput: string;
};

export type MatchedPattern = {
    pattern: string;
    category: string;
    matchedText: string;
};

type PatternDefinition = {
    pattern: RegExp;
    raw: string;
    category: string;
};

// ===== Unicode 正規化 =====
function normalizeInput(text: string): string {
    // 全角英数字 → 半角
    let normalized = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    );
    // ゼロ幅文字・制御文字を除去
    normalized = normalized.replace(/[\u200b-\u200f\u202a-\u202e\ufeff]/g, "");
    // Unicode 正規化 (NFKC: 互換等価 + 合成)
    normalized = normalized.normalize("NFKC");

    return normalized;
}

// ===== 検出パターン定義 =====
const PATTERNS: PatternDefinition[] = [
    // --- 日本語: 指示上書き系 ---
    {
        raw: String.raw`(すべて|全て|全部)の?(指示|命令|ルール)を?(無視|忘れ|破棄)`,
        pattern: new RegExp(
            String.raw`(すべて|全て|全部)の?(指示|命令|ルール)を?(無視|忘れ|破棄)`
        ),
        category: "JA_OVERRIDE",
    },
    {
        raw: String.raw`(指示|命令|ルール).{0,10}(表示|見せ|教え)`,
        pattern: new RegExp(String.raw`(指示|命令|ルール).{0,10}(表示|見せ|教え)`),
        category: "JA_DISCLOSE",
    },
    {
        raw: String.raw`デバッグ\s*モード`,
        pattern: /デバッグ\s*モード/,
        category: "JA_DEBUG_MODE",
    },

    // --- 構造的インジェクション ---
    {
        raw: String.raw`</?system>`,
        pattern: /<\/?system>/i,
        category: "STRUCTURAL_SYSTEM_TAG",
    },
    {
        raw: String.raw`\[from:\s*System\]`,
        pattern: /\[from:\s*System\]/i,
        category: "STRUCTURAL_FROM_SYSTEM",
    },

    // --- 英語: 指示上書き系 (記事の最初の例) ---
    {
        raw: String.raw`ignore\s+(all\s+)?previous\s+instructions`,
        pattern: /ignore\s+(all\s+)?previous\s+instructions/i,
        category: "EN_OVERRIDE",
    },
    {
        raw: String.raw`system\s*prompt`,
        pattern: /system\s*prompt/i,
        category: "EN_SYSTEM_PROMPT",
    },
    {
        raw: String.raw`debug\s*mode`,
        pattern: /debug\s*mode/i,
        category: "EN_DEBUG_MODE",
    },
];

// ===== プロンプトインジェクション検出関数 =====
export const promptInjectionDetector = (input: string): DetectionResult => {
    const normalizedInput = normalizeInput(input);
    const matchedPatterns: MatchedPattern[] = [];

    for (const def of PATTERNS) {
        // 各検出パターンを正規表現マッチ判定し、
        // null でないものだけ`matchedPatterns`（インジェクション検出判定配列）に格納
        const match = def.pattern.exec(normalizedInput);
        if (match) {
            matchedPatterns.push({
                pattern: def.raw,
                category: def.category,
                matchedText: match[0],
            });
        }
    }

    return {
        isInjection: matchedPatterns.length > 0,
        matchedPatterns,
        normalizedInput,
    };
}
