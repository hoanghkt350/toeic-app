import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { IconButton } from "../components/ui/IconButton";
import { Tooltip } from "../components/ui/Tooltip";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  SpellCheck,
  Zap,
  Info,
} from "lucide-react";
import { mockQuestions } from "../data/mockTest";
import type { Question } from "../data/mockTest";
import { analyzeText } from "../utils/mockAIEngine";
import type { AIIssue } from "../utils/mockAIEngine";

export function TestExperiencePage() {
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for Reading/Listening
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string | null>
  >({});
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Record<number, boolean>
  >({});

  // State for Audio Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  // State for Writing
  const [essayText, setEssayText] = useState(
    "In recent years, the impact of technology on society have been profound. Their is many benefits, but also some drawback.",
  );
  const [issues, setIssues] = useState<AIIssue[]>([]);

  useEffect(() => {
    if (mockQuestions[currentIndex].type === "writing") {
      const timer = setTimeout(() => {
        setIssues(analyzeText(essayText));
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    }
  }, [essayText, currentIndex]);

  const question = mockQuestions[currentIndex];
  const isLastQuestion =
    currentIndex === mockQuestions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio player simulation using Web Speech API
  useEffect(() => {
    if (
      isPlaying &&
      question.type === "listening" &&
      question.audioTranscript
    ) {
      const text = question.audioTranscript.join(" ");
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const textBefore = text.substring(0, event.charIndex);
          const wordIndex = textBefore.split(" ").length - 1;
          setCurrentWordIndex(wordIndex);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
      setCurrentWordIndex(-1);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, question]);

  // Stop audio when changing questions
  useEffect(() => {
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  }, [currentIndex]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (id: string) => {
    if (submittedAnswers[question.id]) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: id,
    }));
  };

  const handleSubmit = () => {
    if (!selectedAnswers[question.id]) return;
    setSubmittedAnswers((prev) => ({
      ...prev,
      [question.id]: true,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirstQuestion) setCurrentIndex((prev) => prev - 1);
  };

  const applyFix = (oldText: string, newText: string) => {
    setEssayText((prev) => prev.replace(oldText, newText));
  };

  const openSignup = () => {
    alert("Chức năng đăng ký đang được phát triển!");
  };

  const renderLeftPanel = () => {
    if (question.type === "writing") {
      return (
        <div className="flex-1 overflow-hidden border-r border-border flex flex-col bg-surface-bg">
          <div className="p-8 flex items-center justify-between border-b border-border flex-shrink-0">
            <h2 className="text-xl font-bold text-text-primary">
              {question.title}
            </h2>
            <span className="text-sm font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
              {question.tag}
            </span>
          </div>
          <div className="p-8 flex-shrink-0 bg-slate-50">
            <h3 className="font-semibold text-text-primary mb-2">
              Essay Task
            </h3>
            <p className="text-text-secondary">
              {question.essayPrompt}
            </p>
          </div>
          <div className="flex-1 p-8">
            <textarea
              className="w-full h-full resize-none outline-none text-lg leading-relaxed text-text-primary placeholder-text-secondary"
              placeholder="Start writing your essay here..."
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
            />
          </div>
          <div className="p-4 border-t border-border flex justify-between items-center text-sm text-text-secondary flex-shrink-0 bg-slate-50">
            <span>
              Words:{" "}
              {
                essayText
                  .split(/\s+/)
                  .filter((w) => w.length > 0).length
              }{" "}
              / 250
            </span>
            <span>Last saved: Just now</span>
          </div>
        </div>
      );
    }

    const isSub = submittedAnswers[question.id];
    const selAns = selectedAnswers[question.id];

    return (
      <div className="flex-1 overflow-y-auto border-r border-border p-8 pb-32">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">
              {question.title}
            </h2>
            <span className="text-sm font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
              {question.tag}
            </span>
          </div>

          {question.type === "listening" ? (
            <div className="bg-slate-50 p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-text-secondary">
                  Track 01
                </span>
                <Volume2
                  size={20}
                  className="text-text-secondary"
                />
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-6">
                <div
                  className="bg-brand-primary h-1.5 rounded-full transition-all duration-200"
                  style={{
                    width: `${Math.max(5, ((currentWordIndex + 1) / (question.audioTranscript?.length || 1)) * 100)}%`,
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-center gap-6 mb-6">
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                  <SkipBack size={24} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-brand-primary hover:bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} className="ml-1" />
                  )}
                </button>
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                  <SkipForward size={24} />
                </button>
              </div>
              <div className="bg-surface-bg p-4 rounded-xl border border-border">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                  Transcript
                </h3>
                <div className="text-lg leading-loose text-text-secondary">
                  {question.audioTranscript?.map(
                    (word, index) => (
                      <span
                        key={index}
                        className={`inline-block mr-1.5 px-1 rounded transition-colors duration-200 ${
                          index === currentWordIndex
                            ? "bg-blue-100 text-brand-primary font-medium"
                            : index < currentWordIndex
                              ? "text-text-primary"
                              : "text-text-secondary"
                        }`}
                      >
                        {word}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-bg border border-border rounded-xl p-8 text-xl text-text-primary h-auto overflow-visible whitespace-normal text-wrap shadow-sm">
              {question.content}
            </div>
          )}

          <div
            className={`flex flex-col gap-4 transition-all duration-500 ${isSub ? "opacity-100" : "opacity-30 pointer-events-none"}`}
          >
            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className="text-brand-primary"
              />
              <h3 className="font-semibold text-text-primary">
                {isSub
                  ? "AI Tutor Giải Thích"
                  : "Giải thích chi tiết (Chỉ hiển thị sau khi nộp)"}
              </h3>
            </div>

            <div
              className={`bg-surface-bg border border-border rounded-xl p-6 transition-all duration-500 ${isSub ? "filter-none shadow-md" : "filter blur-[2px]"}`}
            >
              {isSub && selAns === question.correctAnswer && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 font-medium">
                  <CheckCircle2 size={18} /> Tuyệt vời! Bạn đã
                  chọn đúng.
                </div>
              )}
              {isSub && selAns !== question.correctAnswer && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 font-medium">
                  <XCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />
                  <div>
                    Rất tiếc, lựa chọn {selAns} chưa chính xác.
                  </div>
                </div>
              )}
              <p className="text-text-primary leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRightPanel = () => {
    if (question.type === "writing") {
      return (
        <div className="w-96 bg-surface-bg flex flex-col shrink-0 border-l border-border shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="p-6 bg-gradient-to-r from-brand-primary to-blue-500 text-white shadow-sm sticky top-0 z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SpellCheck
                  size={20}
                  className="text-blue-100"
                />
                <h3 className="font-semibold text-lg">
                  AI Writing Tutor
                </h3>
              </div>
              <p className="text-xs text-blue-100 opacity-90">
                Real-time analysis & feedback
              </p>
            </div>
            <span className="text-sm font-medium">
              {currentIndex + 1}/{mockQuestions.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50">
            {issues.length === 0 ? (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center flex flex-col items-center justify-center gap-3 h-full">
                <CheckCircle2
                  size={32}
                  className="text-green-500"
                />
                <div>
                  <h4 className="font-semibold text-green-800">
                    Không tìm thấy lỗi!
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Bài viết của bạn hiện tại rất tuyệt. Hãy
                    tiếp tục viết nhé.
                  </p>
                </div>
              </div>
            ) : (
              issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden ${issue.type === "grammar" ? "border-red-200" : "border-blue-200"}`}
                >
                  <div
                    className={`p-3 border-b border-border flex items-center justify-between ${issue.type === "grammar" ? "bg-red-50/50" : "bg-blue-50/50"}`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${issue.type === "grammar" ? "text-red-600" : "text-brand-primary"}`}
                    >
                      {issue.type === "grammar" ? (
                        <SpellCheck size={14} />
                      ) : (
                        <Zap size={14} />
                      )}
                      {issue.type}
                    </span>
                    <span className="text-xs text-text-secondary">
                      Line {issue.lineNumber}
                    </span>
                  </div>
                  <div className="p-4">
                    {issue.type === "grammar" &&
                    issue.suggestedText ? (
                      <>
                        <div className="text-sm line-through text-text-secondary mb-1">
                          ...{issue.originalText}...
                        </div>
                        <div className="text-sm text-text-primary font-medium mb-3">
                          ...{issue.suggestedText}...
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed bg-slate-50 p-2 rounded-lg border border-border mb-3">
                          {issue.explanation}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="small"
                            className="flex-1"
                            onClick={() =>
                              applyFix(
                                issue.originalText,
                                issue.suggestedText!,
                              )
                            }
                          >
                            Apply Fix
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-text-primary mb-2">
                          Consider upgrading{" "}
                          <span className="font-semibold text-text-primary bg-slate-100 px-1 rounded">
                            {issue.originalText}
                          </span>{" "}
                          to:
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {issue.suggestions?.map(
                            (sug, idx) => (
                              <Tooltip
                                key={idx}
                                content={sug.meaning}
                              >
                                <span
                                  onClick={() =>
                                    applyFix(
                                      issue.originalText,
                                      sug.word,
                                    )
                                  }
                                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium cursor-pointer border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                  {sug.word}
                                </span>
                              </Tooltip>
                            ),
                          )}
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed bg-slate-50 p-2 rounded-lg border border-border">
                          {issue.explanation}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}

            <div className="bg-green-50 rounded-xl p-4 border border-green-200 mt-auto">
              <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold text-sm">
                <Info size={16} /> Overall Assessment
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    Readability
                  </span>
                  <span className="font-medium text-text-primary">
                    Grade 8
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    Vocabulary
                  </span>
                  <span className="font-medium text-green-600">
                    Good
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border flex gap-3 bg-surface-bg">
            <Button
              variant="neutral"
              className="flex-1"
              iconStart={<ChevronLeft size={16} />}
              onClick={handlePrev}
              disabled={isFirstQuestion}
            >
              Câu trước
            </Button>
            <Button
              variant="neutral"
              className="flex-1"
              iconEnd={<ChevronRight size={16} />}
              onClick={handleNext}
              disabled={isLastQuestion}
            >
              Câu tiếp
            </Button>
          </div>
        </div>
      );
    }

    const isSub = submittedAnswers[question.id];
    const selAns = selectedAnswers[question.id];

    return (
      <div className="w-96 bg-surface-bg flex flex-col shrink-0">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">
            Đang làm bài
          </h3>
          <span className="text-sm text-text-secondary">
            {currentIndex + 1}/{mockQuestions.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {question.type !== "writing" && (
            <div className="mb-2">
              <h4 className="font-medium text-text-primary mb-3">
                {question.type === "listening"
                  ? "Chọn đáp án đúng nhất dựa vào đoạn băng:"
                  : "Điền vào chỗ trống:"}
              </h4>
            </div>
          )}
          {question.options?.map((option) => {
            const isSelected = selAns === option.id;
            let stateStyles =
              "border-border hover:border-brand-primary";

            if (isSub) {
              if (option.id === question.correctAnswer) {
                stateStyles = "border-green-500 bg-green-50";
              } else if (isSelected) {
                stateStyles = "border-red-400 bg-red-50";
              } else {
                stateStyles = "border-border opacity-50";
              }
            } else if (isSelected) {
              stateStyles =
                "border-brand-primary bg-brand-primary/5";
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${stateStyles}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center font-medium bg-white ${
                      isSub
                        ? option.id === question.correctAnswer
                          ? "border-green-500 text-green-600"
                          : isSelected
                            ? "border-red-400 text-red-500"
                            : "border-border text-slate-500"
                        : isSelected
                          ? "border-brand-primary text-brand-primary"
                          : "border-border text-slate-700"
                    }`}
                  >
                    {option.id}
                  </div>
                  <span
                    className={
                      isSub
                        ? option.id === question.correctAnswer
                          ? "text-green-800"
                          : isSelected
                            ? "text-red-800"
                            : "text-slate-500"
                        : isSelected
                          ? "text-brand-primary font-medium"
                          : "text-slate-700"
                    }
                  >
                    ({option.id}) {option.text}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="mt-4 pt-4">
            {!isSub ? (
              <Button
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base h-auto"
                onClick={handleSubmit}
                disabled={!selAns}
              >
                Nộp câu trả lời & Xem giải thích
              </Button>
            ) : (
              <Button
                variant="neutral"
                className="w-full py-3 text-base h-auto"
                onClick={() => {
                  setSubmittedAnswers((prev) => ({
                    ...prev,
                    [question.id]: false,
                  }));
                  setSelectedAnswers((prev) => ({
                    ...prev,
                    [question.id]: null,
                  }));
                }}
              >
                Thử lại câu này
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <Button
            variant="neutral"
            className="flex-1"
            iconStart={<ChevronLeft size={16} />}
            onClick={handlePrev}
            disabled={isFirstQuestion}
          >
            Câu trước
          </Button>
          <Button
            variant="neutral"
            className="flex-1"
            iconEnd={<ChevronRight size={16} />}
            onClick={handleNext}
            disabled={isLastQuestion}
          >
            Câu tiếp
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-brand-tertiary absolute inset-0 z-50">
      {/* Test Topbar */}
      <header className="bg-surface-bg border-b border-border h-16 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Tooltip content="Thoát bài thi">
            <IconButton
              icon={<ChevronLeft size={20} />}
              variant="subtle"
              onClick={() => alert("Quay về trang chủ")}
            />
          </Tooltip>
          <div>
            <h1 className="font-semibold text-text-primary">
              Đề mẫu trải nghiệm
            </h1>
            <p className="text-xs text-text-secondary">
              Part {currentIndex + 1}:{" "}
              {question.type === "reading"
                ? "Incomplete Sentences"
                : question.type === "listening"
                  ? "Listening Comprehension"
                  : "Essay Writing"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-text-secondary font-medium">
            <Clock size={16} />
            <span>00:{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {renderLeftPanel()}
        {renderRightPanel()}
      </div>

      {/* Guest Restriction Banner */}
      <div className="fixed bottom-0 left-0 right-96 bg-surface-bg border-t border-border p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between px-8 z-20">
        <div className="flex flex-col">
          <p className="font-semibold text-text-primary text-base truncate">
            Bạn đang xem ở chế độ khách
          </p>
          <p className="text-sm text-text-secondary block">
            Đăng ký tài khoản miễn phí để lưu lại tiến độ làm
            bài và xem toàn bộ giải thích chi tiết.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openSignup}
          size="small"
        >
          Đăng ký ngay
        </Button>
      </div>
    </div>
  );
}