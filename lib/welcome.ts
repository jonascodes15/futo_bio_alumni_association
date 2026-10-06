import { sendEmail, welcomeEmail } from "@/lib/email";

export function sendWelcome(fullName: string, email: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to the FUTO Biology Alumni Network",
    html: welcomeEmail(fullName, process.env.NEXT_PUBLIC_WHATSAPP_LINK ?? ""),
  });
}
