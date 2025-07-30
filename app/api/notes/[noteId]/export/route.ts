import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ noteId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") as "markdown" | "pdf";

    if (!format || !["markdown", "pdf"].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        room: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if user has access to the room
    if (note.room.members.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (format === "markdown") {
      // Convert Slate content to markdown
      const markdown = convertSlateToMarkdown(note.content, note.title);

      return new NextResponse(markdown, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="${note.title}.md"`,
        },
      });
    } else if (format === "pdf") {
      // For PDF export, we'll use a simple HTML to PDF approach
      // In a production environment, you might want to use puppeteer or similar
      const markdown = convertSlateToMarkdown(note.content, note.title);

      // Create a simple HTML version for PDF
      const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>${note.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                        h1 { color: #333; border-bottom: 2px solid #333; }
                        h2 { color: #666; }
                        pre { background: #f4f4f4; padding: 10px; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <pre>${markdown}</pre>
                </body>
                </html>
            `;

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="${note.title}.html"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function convertSlateToMarkdown(content: string, title: string): string {
  try {
    const parsed = JSON.parse(content);
    let markdown = `# ${title}\n\n`;

    parsed.forEach((node: Record<string, unknown>) => {
      if (node.type === "heading-one") {
        markdown += `# ${getTextFromNode(node)}\n\n`;
      } else if (node.type === "heading-two") {
        markdown += `## ${getTextFromNode(node)}\n\n`;
      } else if (node.type === "heading-three") {
        markdown += `### ${getTextFromNode(node)}\n\n`;
      } else if (node.type === "block-quote") {
        markdown += `> ${getTextFromNode(node)}\n\n`;
      } else if (node.type === "bulleted-list") {
        (node.children as Record<string, unknown>[])?.forEach(
          (item: Record<string, unknown>) => {
            markdown += `- ${getTextFromNode(item)}\n`;
          },
        );
        markdown += "\n";
      } else if (node.type === "numbered-list") {
        (node.children as Record<string, unknown>[])?.forEach(
          (item: Record<string, unknown>, index: number) => {
            markdown += `${index + 1}. ${getTextFromNode(item)}\n`;
          },
        );
        markdown += "\n";
      } else {
        const text = getTextFromNode(node);
        if (text.trim()) {
          markdown += `${text}\n\n`;
        }
      }
    });

    return markdown;
  } catch {
    // Fallback for plain text content
    return `# ${title}\n\n${content}`;
  }
}

function getTextFromNode(node: Record<string, unknown> | string): string {
  if (typeof node === "string") return node;
  if (node.text) return node.text as string;
  if (node.children) {
    return (node.children as Record<string, unknown>[])
      .map((child: Record<string, unknown>) => getTextFromNode(child))
      .join("");
  }
  return "";
}
