import nodemailer from "nodemailer";

// Contact form email service
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message?: string;
}

export interface ContactEmailResponse {
  success: boolean;
  error?: string;
}

export class ContactEmailService {
  private static transporter: nodemailer.Transporter | null = null;

  /**
   * Initialize Gmail transporter for contact form emails
   */
  private static initializeTransporter(): nodemailer.Transporter | null {
    if (this.transporter) {
      return this.transporter;
    }

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
      return this.transporter;
    }

    return null;
  }

  /**
   * Send contact form email to admin
   */
  static async sendContactFormEmail(
    formData: ContactFormData,
  ): Promise<ContactEmailResponse> {
    try {
      const transporter = this.initializeTransporter();

      if (!transporter) {
        throw new Error(
          "Gmail SMTP not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.",
        );
      }

      const adminEmail = "monir.mzs17@gmail.com";
      const { html } = this.getContactEmailTemplate(formData);

      const mailOptions = {
        from: `"StudyHub Contact Form" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject: `Contact Form: ${formData.subject}`,
        html,
        replyTo: formData.email, // Allow direct reply to the sender
      };

      const result = await transporter.sendMail(mailOptions);

      console.log("Contact form email sent successfully:", result.messageId);

      return { success: true };
    } catch (error) {
      console.error("Contact email service error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Generate HTML email template for contact form
   */
  private static getContactEmailTemplate(formData: ContactFormData): {
    subject: string;
    html: string;
  } {
    return {
      subject: `Contact Form: ${formData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">StudyHub Contact Form</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 80px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${formData.firstName} ${formData.lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="mailto:${formData.email}" style="color: #007bff; text-decoration: none;">
                      ${formData.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
                  <td style="padding: 8px 0; color: #333;">${formData.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
                         ${
                           formData.message
                             ? `
             <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
               <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Message</h3>
               <div style="background-color: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd;">
                 <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-wrap;">${formData.message}</p>
               </div>
             </div>
             `
                             : ""
                         }
            
            <div style="margin-top: 25px; padding: 15px; background-color: #e9ecef; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                This message was sent from the StudyHub contact form at ${process.env.NEXTAUTH_URL || "studyhub.com"}
              </p>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #6c757d; font-size: 12px;">
              © ${new Date().getFullYear()} StudyHub. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
  }

  /**
   * Check if email service is configured
   */
  static getServiceStatus(): { configured: boolean } {
    return {
      configured: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
    };
  }
}
