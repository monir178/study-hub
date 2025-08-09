import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#333", margin: 0 }}>Welcome to StudyHub!</h1>
      </div>
      <div style={{ padding: "20px" }}>
        <h2>Hello {firstName},</h2>
        <p>
          Welcome to StudyHub! We're excited to have you join our community of
          learners.
        </p>
        <p>Get started by:</p>
        <ul>
          <li>Creating your first study room</li>
          <li>Joining existing study sessions</li>
          <li>Taking notes and tracking your progress</li>
        </ul>
        <p>Happy studying!</p>
        <p>
          Best regards,
          <br />
          The StudyHub Team
        </p>
      </div>
    </div>
  );
}
