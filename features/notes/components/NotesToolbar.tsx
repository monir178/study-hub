"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  FileText,
  FileDown,
  Lock,
} from "lucide-react";
import { NotesToolbarProps } from "../types";

export function NotesToolbar({
  permissions,
  activeTools,
  onToggleMark,
  onToggleBlock,
  onExportMarkdown,
  onExportPDF,
}: NotesToolbarProps) {
  const t = useTranslations("notes");

  return (
    <div className="flex items-center gap-1 p-2 border-b mb-2 flex-wrap">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("bold") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleMark("bold")}
              disabled={!permissions.canEdit}
            >
              <Bold className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("bold")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("italic") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleMark("italic")}
              disabled={!permissions.canEdit}
            >
              <Italic className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("italic")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("underline") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleMark("underline")}
              disabled={!permissions.canEdit}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("underline")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("code") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleMark("code")}
              disabled={!permissions.canEdit}
            >
              <Code className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("code")}</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("heading-one") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleBlock("heading-one")}
              disabled={!permissions.canEdit}
            >
              <Heading1 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("heading1")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("heading-two") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleBlock("heading-two")}
              disabled={!permissions.canEdit}
            >
              <Heading2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("heading2")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("heading-three") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleBlock("heading-three")}
              disabled={!permissions.canEdit}
            >
              <Heading3 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("heading3")}</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("bulleted-list") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleBlock("bulleted-list")}
              disabled={!permissions.canEdit}
            >
              <List className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("bulletList")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("numbered-list") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleBlock("numbered-list")}
              disabled={!permissions.canEdit}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("numberedList")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTools.has("block-quote") ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleBlock("block-quote")}
              disabled={!permissions.canEdit}
            >
              <Quote className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("blockquote")}</TooltipContent>
        </Tooltip>

        {!permissions.canEdit && (
          <div className="ml-auto">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {t("common.readOnly", { defaultValue: "Read Only" })}
            </Badge>
          </div>
        )}

        {permissions.canExport && onExportMarkdown && onExportPDF && (
          <div className="ml-auto flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onExportMarkdown}>
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("exportMarkdown")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onExportPDF}>
                  <FileDown className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("exportPDF")}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </TooltipProvider>
    </div>
  );
}
