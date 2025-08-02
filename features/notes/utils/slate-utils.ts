// Define types for Slate content structure
interface SlateNode {
  type: string;
  children: SlateChild[];
}

interface SlateChild {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  type?: string;
  children?: SlateChild[];
}

// Function to render Slate content as HTML with formatting
export const renderSlateContent = (slateContent: string): string => {
  try {
    const content = JSON.parse(slateContent) as SlateNode[];
    let html = "";

    content.forEach((node: SlateNode) => {
      switch (node.type) {
        case "paragraph":
          html += "<p>";
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            if (child.underline) text = `<u>${text}</u>`;
            if (child.code)
              text = `<code class="bg-muted px-1 py-0.5 rounded text-sm">${text}</code>`;
            html += text;
          });
          html += "</p>";
          break;
        case "heading-one":
          html += '<h1 class="text-2xl font-bold my-2">';
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            html += text;
          });
          html += "</h1>";
          break;
        case "heading-two":
          html += '<h2 class="text-xl font-bold my-2">';
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            html += text;
          });
          html += "</h2>";
          break;
        case "heading-three":
          html += '<h3 class="text-lg font-bold my-2">';
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            html += text;
          });
          html += "</h3>";
          break;
        case "block-quote":
          html +=
            '<blockquote class="border-l-4 border-gray-300 pl-4 my-2 italic">';
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            html += text;
          });
          html += "</blockquote>";
          break;
        case "bulleted-list":
          html += '<ul class="list-disc list-inside my-2">';
          node.children.forEach((child: SlateChild) => {
            if (child.type === "list-item") {
              html += "<li>";
              child.children?.forEach((grandChild: SlateChild) => {
                let text = grandChild.text || "";
                if (grandChild.bold) text = `<strong>${text}</strong>`;
                if (grandChild.italic) text = `<em>${text}</em>`;
                if (grandChild.code)
                  text = `<code class="bg-muted px-1 py-0.5 rounded text-sm">${text}</code>`;
                html += text;
              });
              html += "</li>";
            }
          });
          html += "</ul>";
          break;
        case "numbered-list":
          html += '<ol class="list-decimal list-inside my-2">';
          node.children.forEach((child: SlateChild) => {
            if (child.type === "list-item") {
              html += "<li>";
              child.children?.forEach((grandChild: SlateChild) => {
                let text = grandChild.text || "";
                if (grandChild.bold) text = `<strong>${text}</strong>`;
                if (grandChild.italic) text = `<em>${text}</em>`;
                if (grandChild.code)
                  text = `<code class="bg-muted px-1 py-0.5 rounded text-sm">${text}</code>`;
                html += text;
              });
              html += "</li>";
            }
          });
          html += "</ol>";
          break;
        default:
          // Handle any other node types as paragraphs
          html += "<p>";
          if (node.children) {
            node.children.forEach((child: SlateChild) => {
              let text = child.text || "";
              if (child.bold) text = `<strong>${text}</strong>`;
              if (child.italic) text = `<em>${text}</em>`;
              if (child.underline) text = `<u>${text}</u>`;
              if (child.code)
                text = `<code class="bg-muted px-1 py-0.5 rounded text-sm">${text}</code>`;
              html += text;
            });
          }
          html += "</p>";
      }
    });

    return html;
  } catch {
    // If parsing fails, return the raw content as plain text
    return `<p>${slateContent}</p>`;
  }
};

// Function to convert Slate content to Markdown with formatting
export const slateToMarkdown = (slateContent: string): string => {
  try {
    const content = JSON.parse(slateContent) as SlateNode[];
    let markdown = "";

    content.forEach((node: SlateNode) => {
      switch (node.type) {
        case "paragraph":
          let paragraphText = "";
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `**${text}**`;
            if (child.italic) text = `*${text}*`;
            if (child.underline) text = `__${text}__`;
            if (child.code) text = `\`${text}\``;
            paragraphText += text;
          });
          markdown += paragraphText + "\n\n";
          break;
        case "heading-one":
          let h1Text = "";
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `**${text}**`;
            if (child.italic) text = `*${text}*`;
            h1Text += text;
          });
          markdown += `# ${h1Text}\n\n`;
          break;
        case "heading-two":
          let h2Text = "";
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `**${text}**`;
            if (child.italic) text = `*${text}*`;
            h2Text += text;
          });
          markdown += `## ${h2Text}\n\n`;
          break;
        case "heading-three":
          let h3Text = "";
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `**${text}**`;
            if (child.italic) text = `*${text}*`;
            h3Text += text;
          });
          markdown += `### ${h3Text}\n\n`;
          break;
        case "block-quote":
          let quoteText = "";
          node.children.forEach((child: SlateChild) => {
            let text = child.text || "";
            if (child.bold) text = `**${text}**`;
            if (child.italic) text = `*${text}*`;
            quoteText += text;
          });
          markdown += `> ${quoteText}\n\n`;
          break;
        case "bulleted-list":
          node.children.forEach((child: SlateChild) => {
            if (child.type === "list-item") {
              let listItemText = "";
              child.children?.forEach((grandChild: SlateChild) => {
                let text = grandChild.text || "";
                if (grandChild.bold) text = `**${text}**`;
                if (grandChild.italic) text = `*${text}*`;
                if (grandChild.code) text = `\`${text}\``;
                listItemText += text;
              });
              markdown += `- ${listItemText}\n`;
            }
          });
          markdown += "\n";
          break;
        case "numbered-list":
          let listNumber = 1;
          node.children.forEach((child: SlateChild) => {
            if (child.type === "list-item") {
              let listItemText = "";
              child.children?.forEach((grandChild: SlateChild) => {
                let text = grandChild.text || "";
                if (grandChild.bold) text = `**${text}**`;
                if (grandChild.italic) text = `*${text}*`;
                if (grandChild.code) text = `\`${text}\``;
                listItemText += text;
              });
              markdown += `${listNumber}. ${listItemText}\n`;
              listNumber++;
            }
          });
          markdown += "\n";
          break;
        default:
          // Handle any other node types as paragraphs
          let defaultText = "";
          if (node.children) {
            node.children.forEach((child: SlateChild) => {
              let text = child.text || "";
              if (child.bold) text = `**${text}**`;
              if (child.italic) text = `*${text}*`;
              if (child.underline) text = `__${text}__`;
              if (child.code) text = `\`${text}\``;
              defaultText += text;
            });
          }
          markdown += defaultText + "\n\n";
      }
    });

    return markdown.trim();
  } catch {
    // If parsing fails, return the raw content
    return slateContent;
  }
};
