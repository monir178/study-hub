import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Export note as markdown/pdf
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId, noteId } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "markdown";

    // Get the room and check if user has access
    const room = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        creator: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user is a member of the room
    const userMember = room.members.find(
      (member) => member.user.email === session.user.email,
    );

    if (!userMember && !room.isPublic) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get the specific note
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        roomId,
      },
      include: {
        creator: true,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (format === "markdown") {
      const markdown = convertSlateToMarkdown(note.content);
      return new NextResponse(markdown, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="${note.title}.md"`,
        },
      });
    } else if (format === "pdf") {
      const html = convertSlateToHTML(note.content);
      const pdfBuffer = await convertHTMLToPDF(html, note.title);
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${note.title}.pdf"`,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error exporting note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to convert Slate.js content to Markdown
function convertSlateToMarkdown(content: string): string {
  try {
    const slateContent = JSON.parse(content);
    return slateToMarkdown(slateContent);
  } catch (error) {
    console.error("Error parsing Slate content:", error);
    return "";
  }
}

// Helper function to convert Slate.js content to HTML
function convertSlateToHTML(content: string): string {
  try {
    const slateContent = JSON.parse(content);
    return slateToHTML(slateContent);
  } catch (error) {
    console.error("Error parsing Slate content:", error);
    return "";
  }
}

// Convert Slate.js nodes to Markdown
function slateToMarkdown(
  nodes: Array<{
    type: string;
    children: Array<{
      text: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      code?: boolean;
    }>;
  }>,
): string {
  return nodes
    .map((node) => {
      if (node.type === "paragraph") {
        return (
          node.children
            .map((child) => {
              let text = child.text;
              if (child.bold) text = `**${text}**`;
              if (child.italic) text = `*${text}*`;
              if (child.underline) text = `<u>${text}</u>`;
              if (child.code) text = `\`${text}\``;
              return text;
            })
            .join("") + "\n\n"
        );
      } else if (node.type === "heading-one") {
        return (
          "# " + node.children.map((child) => child.text).join("") + "\n\n"
        );
      } else if (node.type === "heading-two") {
        return (
          "## " + node.children.map((child) => child.text).join("") + "\n\n"
        );
      } else if (node.type === "heading-three") {
        return (
          "### " + node.children.map((child) => child.text).join("") + "\n\n"
        );
      } else if (node.type === "block-quote") {
        return (
          "> " + node.children.map((child) => child.text).join("") + "\n\n"
        );
      } else if (node.type === "bulleted-list") {
        return (
          node.children
            .map(
              (item) =>
                "- " + item.children.map((child) => child.text).join(""),
            )
            .join("\n") + "\n\n"
        );
      } else if (node.type === "numbered-list") {
        return (
          node.children
            .map(
              (item, _index) =>
                `${_index + 1}. ` +
                item.children.map((child) => child.text).join(""),
            )
            .join("\n") + "\n\n"
        );
      }
      return "";
    })
    .join("");
}

// Convert Slate.js nodes to HTML
function slateToHTML(
  nodes: Array<{
    type: string;
    children: Array<{
      text: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      code?: boolean;
    }>;
  }>,
): string {
  return nodes
    .map((node) => {
      if (node.type === "paragraph") {
        return `<p>${node.children
          .map((child) => {
            let text = child.text;
            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            if (child.underline) text = `<u>${text}</u>`;
            if (child.code) text = `<code>${text}</code>`;
            return text;
          })
          .join("")}</p>`;
      } else if (node.type === "heading-one") {
        return `<h1>${node.children.map((child) => child.text).join("")}</h1>`;
      } else if (node.type === "heading-two") {
        return `<h2>${node.children.map((child) => child.text).join("")}</h2>`;
      } else if (node.type === "heading-three") {
        return `<h3>${node.children.map((child) => child.text).join("")}</h3>`;
      } else if (node.type === "block-quote") {
        return `<blockquote>${node.children.map((child) => child.text).join("")}</blockquote>`;
      } else if (node.type === "bulleted-list") {
        return `<ul>${node.children
          .map(
            (item) =>
              `<li>${item.children.map((child) => child.text).join("")}</li>`,
          )
          .join("")}</ul>`;
      } else if (node.type === "numbered-list") {
        return `<ol>${node.children
          .map(
            (item) =>
              `<li>${item.children.map((child) => child.text).join("")}</li>`,
          )
          .join("")}</ol>`;
      }
      return "";
    })
    .join("");
}

// Convert HTML to PDF using jsPDF
async function convertHTMLToPDF(html: string, title: string): Promise<Buffer> {
  // This is a placeholder - you'll need to implement actual PDF generation
  // For now, we'll return a simple text-based PDF
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 20, 20);

  doc.setFontSize(12);
  const lines = html.replace(/<[^>]*>/g, "").split("\n");
  let y = 40;

  lines.forEach((line) => {
    if (line.trim() && y < 280) {
      doc.text(line, 20, y);
      y += 7;
    }
  });

  return Buffer.from(doc.output("arraybuffer"));
}
