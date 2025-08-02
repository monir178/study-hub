import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, FileDown, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { UserNote } from "../types";
import { NotesTitleEditor } from "./NotesTitleEditor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface UserNoteViewerProps {
  selectedNote: UserNote | null;
  titleValue: string;
  isEditingTitle: boolean;
  isJoining: boolean;
  isUserMemberOfRoom: boolean;
  onTitleChange: (value: string) => void;
  onStartEdit: () => void;
  onTitleSave: () => void;
  onTitleCancel: () => void;
  onRoomAction: () => void;
  renderSlateContent: (content: string) => string;
  slateToMarkdown: (content: string) => string;
}

export function UserNoteViewer({
  selectedNote,
  titleValue,
  isEditingTitle,
  isJoining,
  isUserMemberOfRoom,
  onTitleChange,
  onStartEdit,
  onTitleSave,
  onTitleCancel,
  onRoomAction,
  renderSlateContent,
  slateToMarkdown,
}: UserNoteViewerProps) {
  const handleExportMarkdown = () => {
    if (selectedNote) {
      // Convert Slate content to markdown with formatting
      const content = slateToMarkdown(selectedNote.content);
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedNote.title}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportPDF = () => {
    if (selectedNote) {
      // Create a temporary div to render the content
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      tempDiv.style.width = "800px";
      tempDiv.style.padding = "40px";
      tempDiv.style.backgroundColor = "white";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.lineHeight = "1.6";
      tempDiv.style.color = "#333";

      // Create the HTML content with styling
      const content = renderSlateContent(selectedNote.content);
      tempDiv.innerHTML = `
        <div style="margin-bottom: 30px;">
          <h1 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 24px; margin-bottom: 20px;">
            ${selectedNote.title}
          </h1>
          <div style="color: #666; font-size: 14px; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <strong>Room:</strong> ${selectedNote.room.name}<br>
            <strong>Created by:</strong> ${selectedNote.creator.name}<br>
            <strong>Date:</strong> ${format(new Date(selectedNote.updatedAt), "MMM dd, yyyy")}
          </div>
        </div>
        <div style="margin-top: 20px;">
          ${content}
        </div>
      `;

      // Add the temp div to the document
      document.body.appendChild(tempDiv);

      // Convert to canvas and then to PDF
      html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })
        .then((canvas) => {
          // Remove the temporary div
          document.body.removeChild(tempDiv);

          // Create PDF
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = pdfWidth - 20; // 10mm margin on each side
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let heightLeft = imgHeight;
          let position = 10; // 10mm top margin

          // Add first page
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight - 20; // Account for margins

          // Add additional pages if needed
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight - 20;
          }

          // Download the PDF
          pdf.save(`${selectedNote.title}.pdf`);
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
          // Remove the temporary div if there's an error
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
          alert("Failed to generate PDF. Please try again.");
        });
    }
  };

  if (!selectedNote) {
    return (
      <div className="w-1/2">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Note</h3>
            <p className="text-sm text-muted-foreground">
              Choose a note from the list to view its content
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2">
      <div className="h-full flex flex-col">
        {/* Header Row 1: Export dropdown */}
        <div className="flex items-center justify-end p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileDown className="w-4 h-4 mr-2" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportMarkdown}>
                <FileText className="w-4 h-4 mr-2" />
                Download as Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Header Row 2: Note title and room info */}
        <div className="flex items-center justify-between p-4 pb-2">
          <NotesTitleEditor
            title={titleValue}
            isEditing={isEditingTitle}
            onTitleChange={onTitleChange}
            onStartEdit={onStartEdit}
            onSave={onTitleSave}
            onCancel={onTitleCancel}
            permissions={{
              canEdit: false,
              canDelete: false,
              canExport: true,
              canRead: true,
            }}
          />

          <div className="text-sm text-muted-foreground">
            {selectedNote.room.name} •{" "}
            {format(new Date(selectedNote.updatedAt), "MMM dd, yyyy")}
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 px-4 pb-4 overflow-auto">
          <div className="prose prose-sm max-w-none">
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html:
                  renderSlateContent(selectedNote.content) ||
                  "No content available",
              }}
            />
          </div>
        </div>

        {/* Footer: Room Join/Enter Button */}
        <div className="flex-shrink-0 p-4 border-t">
          <Button
            onClick={onRoomAction}
            disabled={isJoining}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {isJoining
              ? "Joining..."
              : isUserMemberOfRoom
                ? `Enter Room: ${selectedNote.room.name}`
                : `Join Room: ${selectedNote.room.name}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
