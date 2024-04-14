export interface Settings {
  problem: Problem;
  language: Language;
}

export enum Problem {
  FizzBuzz = "FizzBuzz",
  HelloWorld = "HelloWorld",
  PrimeSeive = "PrimeSeive",
}

export enum Language {
  Cpp = "cpp",
  Go = "go",
  Python = "python",
  JavaScript = "javascript",
  Rust = "rust",
}


export const PROBLEMS: Record<Problem, string> = {
  "FizzBuzz": `# FizzBuzz\n\
1. Go through numbers 1 to 1000 (inclusive):\n
\t1. If the number is evenly divisible by 3, print (to the standard output) \`Fizz\`\n\
\t2. If the number is divisible by 5, print \`Buzz\`\n\
\t3. If the number is both divisible by 3 and 5, print \`FizzBuzz\` \n\
\t4. If none of the cases apply, print the original number.\n\
\n\
*Hint:* Ensure that your output only uses (\`\\n\`) line endings,\
and ends in a new line.`,

  "PrimeSeive": `# Prime Sieve\n\
Print (to the standard output) all the **prime** numbers between \`1\` and \`10_000\` separated by a newline \`\\n\` character.
\n\
*Hint*: Ensure your output also ends in a newline character \`\\n\`.`,

  "HelloWorld": `# Hello, World!\n\
Print the standard rite-of-passage message: "Hello, World!" into the standard output.`,
}