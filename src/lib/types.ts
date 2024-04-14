export interface Settings {
  problem: Problem;
  language: Language;
}

export enum Problem {
  FizzBuzz = "FizzBuzz",
}

export enum Language {
  C = "c",
  Cpp = "cpp",
  Go = "go",
  Python = "python",
  JavaScript = "javascript",
  Rust = "rust",
}