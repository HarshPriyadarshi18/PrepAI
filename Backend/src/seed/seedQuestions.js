import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("Missing MongoDB URI. Set MONGO_URI in Backend/.env");
}

const questions = [
  {
    title: "Two Sum",
    difficulty: "easy",
    category: "arrays",
    description:
      "Given a line of space-separated integers followed by a target on the next line, print the indices (space-separated) of the two numbers that add up to the target.",
    examples: [
      { input: "2 7 11 15\n9", output: "0 1" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      cpp: "#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    vector<int> nums;\n    stringstream ss(line);\n    int x;\n    while (ss >> x) nums.push_back(x);\n\n    int target;\n    cin >> target;\n\n    // your code here\n    // print two indices separated by a space\n\n    return 0;\n}",
      python:
        "nums = list(map(int, input().split()))\ntarget = int(input())\n\n# your code here\n# print two indices separated by a space\n",
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().trim().split(\"\\\\s+\");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = Integer.parseInt(sc.nextLine().trim());\n\n        // your code here\n        // print two indices separated by a space\n    }\n}",
    },
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3 2 4\n6", expectedOutput: "1 2" },
      { input: "3 3\n6", expectedOutput: "0 1" },
    ],
  },
  {
    title: "Reverse String",
    difficulty: "easy",
    category: "strings",
    description:
      "Given a string on a single line, print the reversed string.",
    examples: [{ input: "hello", output: "olleh" }],
    constraints: ["1 <= s.length <= 10^5"],
    starterCode: {
      cpp: "#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n\n    // your code here\n    // print the reversed string\n\n    return 0;\n}",
      python: "s = input()\n\n# your code here\n# print the reversed string\n",
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n\n        // your code here\n        // print the reversed string\n    }\n}",
    },
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "PrepAI", expectedOutput: "IAperP" },
      { input: "a", expectedOutput: "a" },
    ],
  },
  {
    title: "Valid Parentheses",
    difficulty: "medium",
    category: "stack",
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']' on a single line, print \"true\" if the input string is valid, otherwise print \"false\".",
    examples: [{ input: "()[]{}", output: "true" }],
    constraints: ["1 <= s.length <= 10^4"],
    starterCode: {
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n\n    // your code here\n    // print \"true\" or \"false\"\n\n    return 0;\n}",
      python: "s = input()\n\n# your code here\n# print \"true\" or \"false\"\n",
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n\n        // your code here\n        // print \"true\" or \"false\"\n    }\n}",
    },
    testCases: [
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false" },
      { input: "{[]}", expectedOutput: "true" },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    category: "sliding-window",
    description:
      "Given a string s on a single line, print the length of the longest substring without repeating characters.",
    examples: [{ input: "abcabcbb", output: "3" }],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    starterCode: {
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n\n    // your code here\n    // print the length\n\n    return 0;\n}",
      python: "s = input()\n\n# your code here\n# print the length\n",
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n\n        // your code here\n        // print the length\n    }\n}",
    },
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" },
    ],
  },
  {
    title: "Merge K Sorted Lists",
    difficulty: "hard",
    category: "linked-list",
    description:
      "Given k sorted lists on a single line, formatted as space-separated numbers with each list separated by a semicolon (e.g. \"1 4 5;1 3 4;2 6\"), print the fully merged sorted list as space-separated numbers.",
    examples: [
      { input: "1 4 5;1 3 4;2 6", output: "1 1 2 3 4 4 5 6" },
    ],
    constraints: ["k == lists.length", "0 <= k <= 10^4"],
    starterCode: {
      cpp: "#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n\n    // parse semicolon-separated lists, merge them, and print space-separated result\n    // your code here\n\n    return 0;\n}",
      python:
        "line = input()\nlists = [list(map(int, part.split())) for part in line.split(';') if part.strip()]\n\n# your code here\n# print the merged sorted list, space-separated\n",
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n\n        // parse semicolon-separated lists, merge them, and print space-separated result\n        // your code here\n    }\n}",
    },
    testCases: [
      { input: "1 4 5;1 3 4;2 6", expectedOutput: "1 1 2 3 4 4 5 6" },
      { input: ";", expectedOutput: "" },
      { input: "1", expectedOutput: "1" },
    ],
  },
  {
    title: "N-Queens",
    difficulty: "hard",
    category: "backtracking",
    description:
      "Given an integer n on a single line, print the total number of distinct solutions to the n-queens puzzle.",
    examples: [{ input: "4", output: "2" }],
    constraints: ["1 <= n <= 9"],
    starterCode: {
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n\n    // your code here\n    // print the number of solutions\n\n    return 0;\n}",
      python: "n = int(input())\n\n# your code here\n# print the number of solutions\n",
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        // your code here\n        // print the number of solutions\n    }\n}",
    },
    testCases: [
      { input: "4", expectedOutput: "2" },
      { input: "1", expectedOutput: "1" },
      { input: "8", expectedOutput: "92" },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    await Question.deleteMany({});
    const result = await Question.insertMany(questions);

    console.log(`Questions seeded successfully: ${result.length} questions inserted`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();