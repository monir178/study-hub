import nodemailer from "nodemailer";

// Initialize Gmail transporter
let gmailTransporter: nodemailer.Transporter | null = null;

// Initialize Gmail transporter if configured
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// Email service types
export interface EmailResponse {
  success: boolean;
  data?: {
    messageId?: string;
    envelope?: object;
    accepted?: string[];
    rejected?: string[];
    pending?: string[];
    response?: string;
  };
  error?: string;
}

export interface EmailData {
  to: string;
  firstName?: string;
  resetToken?: string;
  verificationToken?: string;
  otp?: string;
  purpose?: "WELCOME" | "PASSWORD_RESET" | "EMAIL_VERIFICATION" | "OTP";
}

export class UnifiedEmailService {
  /**
   * Send email via Gmail SMTP
   * Requires Gmail to be configured
   */
  private static async sendEmail(
    emailData: EmailData,
    template: "welcome" | "password-reset" | "verification" | "otp",
  ): Promise<EmailResponse> {
    try {
      if (!gmailTransporter) {
        throw new Error(
          "Gmail SMTP not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.",
        );
      }

      console.log(`Sending ${template} email via Gmail SMTP to:`, emailData.to);
      return await this.sendViaGmail(emailData, template);
    } catch (error) {
      console.error("Email service error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send via Gmail SMTP
   */
  private static async sendViaGmail(
    emailData: EmailData,
    template: "welcome" | "password-reset" | "verification" | "otp",
  ): Promise<EmailResponse> {
    if (!gmailTransporter) {
      throw new Error("Gmail transporter not initialized");
    }

    const { subject, html } = this.getEmailTemplate(emailData, template);

    const mailOptions = {
      from: `"StudyHub" <${process.env.GMAIL_USER}>`,
      to: emailData.to,
      subject,
      html,
    };

    const result = await gmailTransporter.sendMail(mailOptions);
    return { success: true, data: result };
  }

  /**
   * Get email template for Gmail
   */
  private static getEmailTemplate(
    emailData: EmailData,
    template: "welcome" | "password-reset" | "verification" | "otp",
  ): { subject: string; html: string } {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    switch (template) {
      case "welcome":
        return {
          subject: "Welcome to StudyHub!",
          html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                                <h1 style="color: #333; margin: 0;">Welcome to StudyHub!</h1>
                            </div>
                            <div style="padding: 20px;">
                                <h2>Hello ${emailData.firstName || "User"},</h2>
                                <p>Welcome to StudyHub! We're excited to have you join our community of learners.</p>
                                <p>Get started by:</p>
                                <ul>
                                    <li>Creating your first study room</li>
                                    <li>Joining existing study sessions</li>
                                    <li>Taking notes and tracking your progress</li>
                                </ul>
                                <p>Happy studying!</p>
                                <p>Best regards,<br />The StudyHub Team</p>
                            </div>
                        </div>
                    `,
        };

      case "password-reset":
        return {
          subject: "Reset Your StudyHub Password",
          html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                                <h1 style="color: #333; margin: 0;">Password Reset Request</h1>
                            </div>
                            <div style="padding: 20px;">
                                <h2>Hello ${emailData.firstName || "User"},</h2>
                                <p>We received a request to reset your password for your StudyHub account.</p>
                                <p>Click the button below to reset your password:</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${baseUrl}/auth/reset-password?token=${emailData.resetToken}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                        Reset Password
                                    </a>
                                </div>
                                <p>If you didn't request this password reset, you can safely ignore this email.</p>
                                <p>This link will expire in 1 hour for security reasons.</p>
                                <p>Best regards,<br />The StudyHub Team</p>
                            </div>
                        </div>
                    `,
        };

      case "verification":
        return {
          subject: "Verify Your StudyHub Account",
          html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                                <h1 style="color: #333; margin: 0;">Verify Your Email</h1>
                            </div>
                            <div style="padding: 20px;">
                                <h2>Hello ${emailData.firstName || "User"},</h2>
                                <p>Thank you for signing up for StudyHub! Please verify your email address to complete your registration.</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${baseUrl}/auth/verify?token=${emailData.verificationToken}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                        Verify Email
                                    </a>
                                </div>
                                <p>If you didn't create a StudyHub account, you can safely ignore this email.</p>
                                <p>Best regards,<br />The StudyHub Team</p>
                            </div>
                        </div>
                    `,
        };

      case "otp":
        return {
          subject: "Your StudyHub Verification Code",
          html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                                <h1 style="color: #333; margin: 0;">Verification Code</h1>
                            </div>
                            <div style="padding: 20px;">
                                <h2>Hello ${emailData.firstName || "User"},</h2>
                                <p>Your verification code is:</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <div style="background-color: #007bff; color: white; padding: 20px; font-size: 24px; font-weight: bold; border-radius: 5px; display: inline-block;">
                                        ${emailData.otp}
                                    </div>
                                </div>
                                <p>This code will expire in 10 minutes.</p>
                                <p>If you didn't request this code, you can safely ignore this email.</p>
                                <p>Best regards,<br />The StudyHub Team</p>
                            </div>
                        </div>
                    `,
        };

      default:
        throw new Error(`Unknown template: ${template}`);
    }
  }

  /**
   * Public methods for different email types
   */
  static async sendWelcomeEmail(
    to: string,
    firstName?: string,
  ): Promise<EmailResponse> {
    return this.sendEmail({ to, firstName }, "welcome");
  }

  static async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    firstName?: string,
  ): Promise<EmailResponse> {
    return this.sendEmail({ to, resetToken, firstName }, "password-reset");
  }

  static async sendVerificationEmail(
    to: string,
    verificationToken: string,
    firstName?: string,
  ): Promise<EmailResponse> {
    return this.sendEmail({ to, verificationToken, firstName }, "verification");
  }

  static async sendOtpEmail(
    to: string,
    otp: string,
    firstName?: string,
  ): Promise<EmailResponse> {
    return this.sendEmail({ to, otp, firstName }, "otp");
  }

  /**
   * Get service status
   */
  static getServiceStatus() {
    return {
      gmailConfigured: !!gmailTransporter,
      canSendToAnyEmail: !!gmailTransporter,
    };
  }
}
