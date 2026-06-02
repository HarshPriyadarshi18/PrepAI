import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// Load the parser implementation directly to avoid the package index debug runner
const pdf = require("pdf-parse/lib/pdf-parse.js");

const extractTextFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
};

export default extractTextFromPDF;