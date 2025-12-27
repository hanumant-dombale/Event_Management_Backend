import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const renderTemplate = (templateName, variables = {}) => {
  const templatePath = path.join(
    __dirname,
    "templates",
    `${templateName}.html`,
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  });

  return html;
};

export { renderTemplate };
