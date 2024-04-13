export const ALLOWED_WORDS = [
  "banana",
  "apple",
  "fuck",
  "you",
  "myself",
  "orange",
  "accessory",
  "anemone",
  "choir",
  "February",
  "onomatopoeia",
];

export class SpeechCapture {
  static nextId = 0;
  static recognition: any;
  static listeners: Record<number, (word: string) => void> = [];

  static init() {
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    window.SpeechGrammarList =
      window.SpeechGrammarList || window.webkitSpeechGrammarList;

    this.listeners = {};
    this.nextId = 0;

    this.recognition = new SpeechRecognition();

    // This makes it actually quite hard
    this.recognition.interimResults = false;
    this.recognition.continuous = false;
    this.recognition.maxAlternatives = 1;

    // Infinite loooop
    this.recognition.start();
    this.recognition.addEventListener("end", this.recognition.start);

    this.recognition.addEventListener("result", (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map(result => result.transcript)
        .join("");

      for (const l of Object.values(this.listeners)) {
        for (const word of transcript.split(" ")) {
          l(word);
        }
      }
    });
  }

  static listenForWord(listener: (word: string) => void) {
    const currId = this.nextId;
    this.nextId++;
    this.listeners[currId] = listener;
    return currId;
  }

  static removeWordListener(id: number) {
    delete this.listeners[id];
  }
}
