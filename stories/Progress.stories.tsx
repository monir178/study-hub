import type { Meta, StoryObj } from "@storybook/nextjs";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 33,
    className: "w-[60%]",
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    className: "w-[60%]",
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    className: "w-[60%]",
  },
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(13);

    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return <Progress value={progress} className="w-[60%]" />;
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>75%</span>
      </div>
      <Progress value={75} className="w-[60%]" />
    </div>
  ),
};
