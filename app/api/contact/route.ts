import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ContactEmailService } from "@/lib/email/contact-email.service";

// Contact form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(100),
  message: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactFormSchema.parse(body);

    // Check if email service is configured
    const emailStatus = ContactEmailService.getServiceStatus();
    if (!emailStatus.configured) {
      return NextResponse.json(
        {
          success: false,
          error: "Email service is not configured. Please try again later.",
        },
        { status: 503 },
      );
    }

    // Send contact form email
    const emailResponse =
      await ContactEmailService.sendContactFormEmail(validatedData);

    if (!emailResponse.success) {
      console.error("Failed to send contact form email:", emailResponse.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send message. Please try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully. We'll get back to you soon!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data. Please check your inputs.",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}
