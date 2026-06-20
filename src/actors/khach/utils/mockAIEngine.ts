export interface Suggestion {
  word: string;
  meaning?: string;
}

export interface AIIssue {
  id: string;
  type: "grammar" | "vocabulary";
  originalText: string;
  suggestedText?: string;
  explanation: string;
  suggestions?: Suggestion[];
  lineNumber?: number;
}

export const analyzeText = (text: string): AIIssue[] => {
  const issues: AIIssue[] = [];
  const lines = text.split("\n");

  const findLineNumber = (matchText: string) => {
    const idx = lines.findIndex((line) =>
      line.includes(matchText),
    );
    return idx !== -1 ? idx + 1 : 1;
  };

  if (
    /\b(impact|society)\s+(of\s+\w+\s+on\s+\w+\s+)?have\b/i.test(
      text,
    )
  ) {
    const match = text.match(
      /\b(impact|society)\s+(of\s+\w+\s+on\s+\w+\s+)?have\b/i,
    );
    if (match) {
      const original = match[0];
      const suggested = original.replace(/\bhave\b/i, "has");
      issues.push({
        id: "g1",
        type: "grammar",
        originalText: original,
        suggestedText: suggested,
        explanation:
          'Chủ ngữ số ít ("impact" / "society") yêu cầu động từ chia ở số ít ("has" thay vì "have").',
        lineNumber: findLineNumber(original),
      });
    }
  }

  if (/\btheir\s+is\b/i.test(text)) {
    const original =
      text.match(/\btheir\s+is\b/i)?.[0] || "Their is";
    issues.push({
      id: "g2",
      type: "grammar",
      originalText: original,
      suggestedText: "There are",
      explanation:
        '"Their" là tính từ sở hữu. Để chỉ sự tồn tại của số nhiều ("benefits"), bạn nên dùng "There are".',
      lineNumber: findLineNumber(original),
    });
  }

  if (/\bdrawbacks?\b/i.test(text)) {
    const original =
      text.match(/\bdrawbacks?\b/i)?.[0] || "drawback";
    issues.push({
      id: "v1",
      type: "vocabulary",
      originalText: original,
      explanation:
        'Bạn có thể dùng các từ vựng học thuật (academic) cao cấp hơn để thay thế cho "drawback".',
      suggestions: [
        { word: "disadvantage", meaning: "bất lợi" },
        { word: "limitation", meaning: "hạn chế" },
      ],
      lineNumber: findLineNumber(original),
    });
  }

  if (/\bvery\s+good\b/i.test(text)) {
    const original =
      text.match(/\bvery\s+good\b/i)?.[0] || "very good";
    issues.push({
      id: "v2",
      type: "vocabulary",
      originalText: original,
      explanation:
        "Nâng cấp từ vựng để câu văn mang tính chuyên nghiệp và thuyết phục hơn.",
      suggestions: [
        { word: "excellent", meaning: "xuất sắc" },
        { word: "outstanding", meaning: "nổi bật" },
      ],
      lineNumber: findLineNumber(original),
    });
  }

  if (/\ba\s+lot\s+of\b/i.test(text)) {
    const original =
      text.match(/\ba\s+lot\s+of\b/i)?.[0] || "a lot of";
    issues.push({
      id: "v3",
      type: "vocabulary",
      originalText: original,
      explanation:
        'Trong văn bản học thuật (essay), nên tránh dùng "a lot of". Bạn có thể thay bằng các từ trang trọng hơn.',
      suggestions: [
        { word: "numerous", meaning: "nhiều, vô số kể" },
        { word: "abundant", meaning: "dồi dào, phong phú" },
      ],
      lineNumber: findLineNumber(original),
    });
  }

  return issues;
};