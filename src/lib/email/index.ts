import { Resend } from "resend";

export interface IEmailService {
  sendInvitation(email: string, token: string, role: string): Promise<void>;
}

export class ResendEmailService implements IEmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  }

  async sendInvitation(email: string, token: string, role: string): Promise<void> {
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/register?token=${token}`;
    
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: "Apartman Plus Davetiyesi",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Apartman Plus'a Hoş Geldiniz!</h2>
            <p>Yönetici sizi <strong>${role}</strong> olarak sisteme davet etti.</p>
            <p>Aşağıdaki butona tıklayarak kaydınızı tamamlayabilirsiniz:</p>
            <a href="${inviteLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              Daveti Kabul Et
            </a>
            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Bu link 7 gün boyunca geçerlidir.
            </p>
          </div>
        `
      });
      console.log(`📧 Invitation sent to ${email} via Resend`);
    } catch (error) {
      console.error("❌ Failed to send email via Resend:", error);
      throw error;
    }
  }
}

export class ConsoleEmailService implements IEmailService {
  async sendInvitation(email: string, token: string, role: string): Promise<void> {
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/register?token=${token}`;
    
    console.log("----------------------------------------");
    console.log(`📧 [MOCK EMAIL] To: ${email}`);
    console.log(`🔗 Subject: You have been invited to join Apartman Plus`);
    console.log(`📝 Role: ${role}`);
    console.log(`👉 Link: ${inviteLink}`);
    console.log("----------------------------------------");

    // For E2E testing: Write to a file
    if (process.env.NODE_ENV === "development") {
        const fs = await import("fs");
        const path = await import("path");
        const logPath = path.join(process.cwd(), "invites.log");
        fs.writeFileSync(logPath, inviteLink); 
    }
  }
}

// Factory to choose implementation
const apiKey = process.env.RESEND_API_KEY;
export const emailService = apiKey 
  ? new ResendEmailService(apiKey) 
  : new ConsoleEmailService();

