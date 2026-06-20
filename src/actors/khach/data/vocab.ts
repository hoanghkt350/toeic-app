/** Database từ vựng luyện phát âm (in-code, demo — không cần backend). */
export interface VocabWord {
  word: string;
  phonetic: string;
  meaning: string;
}

export const practiceWords: VocabWord[] = [
  { word: "schedule", phonetic: "/ˈskedʒ.uːl/", meaning: "lịch trình" },
  { word: "available", phonetic: "/əˈveɪ.lə.bəl/", meaning: "có sẵn" },
  { word: "colleague", phonetic: "/ˈkɑː.liːɡ/", meaning: "đồng nghiệp" },
  { word: "warehouse", phonetic: "/ˈwer.haʊs/", meaning: "nhà kho" },
  { word: "receipt", phonetic: "/rɪˈsiːt/", meaning: "biên lai" },
  { word: "invoice", phonetic: "/ˈɪn.vɔɪs/", meaning: "hóa đơn" },
  { word: "deadline", phonetic: "/ˈded.laɪn/", meaning: "hạn chót" },
  { word: "negotiate", phonetic: "/nəˈɡoʊ.ʃi.eɪt/", meaning: "đàm phán" },
  { word: "warranty", phonetic: "/ˈwɔːr.ən.t̬i/", meaning: "bảo hành" },
  { word: "purchase", phonetic: "/ˈpɝː.tʃəs/", meaning: "mua" },
  { word: "reservation", phonetic: "/ˌrez.ɚˈveɪ.ʃən/", meaning: "đặt chỗ" },
  { word: "merchandise", phonetic: "/ˈmɝː.tʃən.daɪz/", meaning: "hàng hóa" },
  { word: "itinerary", phonetic: "/aɪˈtɪn.ɚ.er.i/", meaning: "hành trình" },
  { word: "questionnaire", phonetic: "/ˌkwes.tʃəˈner/", meaning: "bảng câu hỏi" },
  { word: "entrepreneur", phonetic: "/ˌɑːn.trə.prəˈnɝː/", meaning: "doanh nhân" },
];

/** Khách được luyện miễn phí 10 từ đầu; từ thứ 11 yêu cầu đăng nhập. */
export const GUEST_FREE_LIMIT = 10;
