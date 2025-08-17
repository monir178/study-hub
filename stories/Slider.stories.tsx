import type { Meta, StoryObj } from "@storybook/nextjs";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: "w-[60%]",
  },
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    className: "w-[60%]",
  },
};

export const WithSteps: Story = {
  args: {
    defaultValue: [20],
    max: 100,
    step: 10,
    className: "w-[60%]",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
    className: "w-[60%]",
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState([50]);

    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-sm font-medium">Volume</label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          className="w-[60%]"
        />
      </div>
    );
  },
};
