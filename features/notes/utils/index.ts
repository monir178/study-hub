/**
 * Utility functions for notes feature
 */

/**
 * Extract plain text from Slate.js JSON content
 */
export const extractTextFromSlateContent = (content: string): string => {
  try {
    const parsed = JSON.parse(content);

    const extractText = (nodes: unknown[]): string => {
      return nodes
        .map((node) => {
          const nodeObj = node as { text?: string; children?: unknown[] };
          if (nodeObj.text !== undefined) {
            return nodeObj.text;
          }
          if (nodeObj.children && Array.isArray(nodeObj.children)) {
            return extractText(nodeObj.children);
          }
          return "";
        })
        .join("");
    };

    if (Array.isArray(parsed)) {
      return extractText(parsed);
    }

    return content; // Fallback to original content if parsing fails
  } catch {
    // If it's not valid JSON, assume it's plain text
    return content;
  }
};

/**
 * Format date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .replace(" at ", " at ");
};

/**
 * Format last saved time using date-fns
 */
export const formatLastSaved = async (
  updatedAt?: string,
): Promise<string | null> => {
  if (!updatedAt) return null;

  try {
    const { formatDistanceToNow } = await import("date-fns");
    const date = new Date(updatedAt);
    return `Saved ${formatDistanceToNow(date, { addSuffix: true })}`;
  } catch {
    return null;
  }
};

/**
 * Get truncated text for note preview
 */
export const getNotePreview = (
  content: string,
  maxLength: number = 100,
): string => {
  const plainText = extractTextFromSlateContent(content);
  return plainText.length > maxLength
    ? `${plainText.substring(0, maxLength)}...`
    : plainText || "No content";
};
