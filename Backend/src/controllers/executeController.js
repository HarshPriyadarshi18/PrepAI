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

export const runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    const config = LANGUAGE_MAP[language];
    if (!config) {
      return res.status(400).json({ success: false, message: "Unsupported language" });
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
        return res.status(502).json({
          success: false,
          message: jdoodleData.message || jdoodleData.error || `JDoodle API failed: ${jdoodleRes.status}`,
        });
      }

      const output = jdoodleData.output || "No output";
      return res.status(200).json({
        success: true,
        output: output.trim(),
        status: jdoodleData.statusCode === 200 ? "Success" : "Error",
      });
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
      return res.status(502).json({ success: false, message: `Piston API failed: ${pistonRes.status}` });
    }

    const result = await pistonRes.json();

    let output = "";
    if (result.compile?.stderr) output += `Compile Error:\n${result.compile.stderr}\n`;
    if (result.run?.stderr) output += `Runtime Error:\n${result.run.stderr}\n`;
    if (result.run?.stdout) output += result.run.stdout;
    if (!output) output = "No output";

    return res.status(200).json({
      success: true,
      output: output.trim(),
      status: result.run?.code === 0 ? "Success" : "Error",
    });
  } catch (error) {
    console.error("Execute controller crashed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};