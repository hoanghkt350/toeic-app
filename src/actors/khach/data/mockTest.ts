export type QuestionType = "reading" | "listening" | "writing";

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  tag: string;
  content?: string;
  options?: Option[];
  correctAnswer?: string;
  explanation?: React.ReactNode | string;
  audioTranscript?: string[];
  essayPrompt?: string;
}

export const mockQuestions: Question[] = [
  {
    id: 1,
    type: "reading",
    title: "Question 1",
    tag: "Reading",
    content:
      "The new manager will introduce _________ ideas for the marketing campaign during the meeting tomorrow.",
    options: [
      { id: "A", text: "he" },
      { id: "B", text: "him" },
      { id: "C", text: "his" },
      { id: "D", text: "himself" },
    ],
    correctAnswer: "C",
    explanation:
      'Vì chỗ trống cần một tính từ sở hữu đứng trước danh từ "ideas" để tạo thành cụm danh từ "his ideas" (những ý tưởng của ông ấy). A là đại từ nhân xưng, B là đại từ tân ngữ, D là đại từ phản thân đều không phù hợp.',
  },
  {
    id: 2,
    type: "listening",
    title: "Question 2",
    tag: "Listening",
    content:
      "What misconception about coral reefs does the speaker correct?",
    audioTranscript: [
      "Welcome",
      "to",
      "today's",
      "lecture",
      "on",
      "marine",
      "biology.",
      "Today,",
      "we",
      "will",
      "be",
      "discussing",
      "the",
      "fascinating",
      "ecosystem",
      "of",
      "coral",
      "reefs.",
      "These",
      "structures",
      "are",
      "not",
      "plants,",
      "but",
      "actually",
      "colonies",
      "of",
      "tiny",
      "animals",
      "called",
      "polyps.",
    ],
    options: [
      {
        id: "A",
        text: "They are found only in shallow waters.",
      },
      { id: "B", text: "They are a type of underwater plant." },
      {
        id: "C",
        text: "They are immune to temperature changes.",
      },
      {
        id: "D",
        text: "They are composed of non-living rocks.",
      },
    ],
    correctAnswer: "B",
    explanation:
      'Người nói giải thích rõ ràng: "These structures are not plants, but actually colonies of tiny animals..." (Những cấu trúc này không phải là thực vật, mà thực chất là những quần thể động vật nhỏ bé...). Điều này trực tiếp sửa lại quan niệm sai lầm rằng san hô là thực vật.',
  },
  {
    id: 3,
    type: "writing",
    title: "Question 3",
    tag: "Writing",
    essayPrompt:
      "Discuss the advantages and disadvantages of artificial intelligence in modern education. Write at least 250 words.",
    explanation: "AI Tutor Panel",
  },
];