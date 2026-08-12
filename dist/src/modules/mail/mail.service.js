import fs from "fs/promises";
import handlebars from "handlebars";
import { createTransport } from "nodemailer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
export class MailService {
    transporter;
    constructor() {
        this.transporter = createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        this.transporter = createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    renderTemplates = async (templateName, context) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const templateDir = path.resolve(__dirname, "./tempelate");
        const templatePath = path.join(templateDir, `${templateName}.hbs`);
        const templateSource = await fs.readFile(templatePath, "utf-8");
        const compiledTemplate = handlebars.compile(templateSource);
        return compiledTemplate(context);
    };
    sendEmail = async (to, subject, templateName, context) => {
        const html = await this.renderTemplates(templateName, context);
        await this.transporter.sendMail({
            to: to,
            subject: subject,
            html: html,
        });
    };
}
