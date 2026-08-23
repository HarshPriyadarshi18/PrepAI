// Config for the NEW company-wise + round-wise interview feature
// Kept separate from the generic role-only interview system.

export const companyProfiles = {
  Amazon: "FAANG-style: DSA-heavy (arrays, trees, graphs, DP), Leadership Principles behavioral questions, system design basics for senior roles.",
  Google: "FAANG-style: strong algorithmic thinking, DSA, some system design, problem-solving approach matters more than exact syntax.",
  Microsoft: "FAANG-style: DSA + practical coding, some behavioral, focus on clean code and edge cases.",
  TCS: "Service-based: OOPs concepts, DBMS, OS fundamentals, basic coding logic, communication skills.",
  Infosys: "Service-based: aptitude-adjacent technical questions, pseudo-code, strong HR round focus.",
  Wipro: "Service-based: fundamentals + basic coding, less DSA depth, communication-focused.",
  Cognizant: "Service-based: core CS subjects, basic programming, behavioral/communication heavy.",
  General: "Standard software engineering interview: mix of DSA, fundamentals, and behavioral questions.",
};

export const roundProfiles = {
  OA: "Online Assessment style: aptitude, logical reasoning, and 1-2 coding problems, no interaction — objective and code-based only.",
  Technical1: "First technical round: DSA problems, coding, basic CS fundamentals (OOPs, DBMS, OS).",
  Technical2: "Second technical round: deeper DSA, system design basics, project deep-dive questions.",
  HR: "HR/Behavioral round: tell me about yourself, strengths/weaknesses, why this company, salary expectations, situational questions.",
};

export const getCompanyContext = (company) => companyProfiles[company] || companyProfiles["General"];
export const getRoundContext = (round) => roundProfiles[round] || roundProfiles["Technical1"];