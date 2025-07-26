"use client";

import { BookOpen, Target, Lightbulb, Timer, Brain } from "lucide-react";
import { FloatingStudyIcon } from "./FloatingStudyIcon";

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingStudyIcon
        icon={BookOpen}
        className="left-[12%] top-[20%]"
        delay={0.8}
        size={26}
      />
      <FloatingStudyIcon
        icon={Target}
        className="right-[18%] top-[30%]"
        delay={1.0}
        size={24}
      />
      <FloatingStudyIcon
        icon={Lightbulb}
        className="left-[25%] top-[75%]"
        delay={1.2}
        size={24}
      />
      <FloatingStudyIcon
        icon={Timer}
        className="right-[12%] top-[70%]"
        delay={1.3}
        size={22}
      />
      <FloatingStudyIcon
        icon={Brain}
        className="left-[85%] top-[80%]"
        delay={1.4}
        size={24}
      />
    </div>
  );
}
