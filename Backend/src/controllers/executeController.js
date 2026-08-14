const LANGUAGE_MAP = {
  cpp: { language: "cpp", version: "10.2.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

const JDoodle_LANGUAGE_MAP = {
  cpp: { language: "cpp17", versionIndex: "0" },
  python: { language: "python3", versionIndex: "3" },
  java: { language: "java", versionIndex: "4" },
};

const FILE_NAMES = {
  cpp: "main.cpp",
  python: "main.py",
  java: "Main.java",
};

// helper — ek single code run (JDoodle first, Piston fallback), sirf trimmed output return karta hai
const runOnce = async (code, language, input) => {
  const config = LANGUAGE_MAP[language];
  if (!config) {
    throw new Error("Unsupported language");
  }

  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    const jdoodlePayload = {
      clientId,
      clientSecret,
      script: code,
      language: JDoodle_LANGUAGE_MAP[language].language,
      versionIndex: JDoodle_LANGUAGE_MAP[language].versionIndex,
      stdin: input || "",
    };

    const jdoodleRes = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jdoodlePayload),
    });

    const jdoodleData = await jdoodleRes.json();

    if (!jdoodleRes.ok || jdoodleData.error) {
      console.error("JDoodle API error:", jdoodleRes.status, jdoodleData);
      throw new Error(jdoodleData.message || jdoodleData.error || `JDoodle API failed: ${jdoodleRes.status}`);
    }

    return (jdoodleData.output || "").trim();
  }

  const pistonRes = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: config.language,
      version: config.version,
      files: [{ name: FILE_NAMES[language], content: code }],
      stdin: input || "",
    }),
  });

  if (!pistonRes.ok) {
    const errText = await pistonRes.text();
    console.error("Piston API error:", pistonRes.status, errText);
    throw new Error(`Piston API failed: ${pistonRes.status}`);
  }

  const result = await pistonRes.json();

  let output = "";
  if (result.compile?.stderr) output += `Compile Error:\n${result.compile.stderr}\n`;
  if (result.run?.stderr) output += `Runtime Error:\n${result.run.stderr}\n`;
  if (result.run?.stdout) output += result.run.stdout;

  return output.trim();
};

export const runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: "code and language are required" });
    }
    if (!LANGUAGE_MAP[language]) {
      return res.status(400).json({ success: false, message: "Unsupported language" });
    }

    const output = await runOnce(code, language, input);

    return res.status(200).json({
      success: true,
      output: output || "No output",
      status: "Success",
    });
  } catch (error) {
    console.error("Execute controller crashed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// NAYA — candidate ke code ko multiple test cases ke against check karta hai aur score deta hai (out of 10)
export const submitCode = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ success: false, message: "code, language and testCases are required" });
    }
    if (!LANGUAGE_MAP[language]) {
      return res.status(400).json({ success: false, message: "Unsupported language" });
    }

    let passed = 0;
    const results = [];

    for (const tc of testCases) {
      let actualOutput = "";
      let runError = null;

      try {
        actualOutput = await runOnce(code, language, tc.input);
      } catch (err) {
        runError = err.message;
      }

      const expected = (tc.expectedOutput || "").trim();
      const actual = (actualOutput || "").trim();
      const isMatch = !runError && expected === actual;

      if (isMatch) passed++;

      results.push({
        input: tc.input,
        expectedOutput: expected,
        actualOutput: runError ? `Error: ${runError}` : actual,
        passed: isMatch,
      });
    }

    const total = testCases.length;
    const score = Math.round((passed / total) * 10);

    return res.status(200).json({
      success: true,
      passed,
      total,
      score,
      results,
    });
  } catch (error) {
    console.error("Submit controller crashed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};