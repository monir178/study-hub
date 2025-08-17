import type { Meta, StoryObj } from "@storybook/nextjs";
import { Badge } from "@/components/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>
        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
        Online
      </Badge>
      <Badge variant="secondary">
        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
        Away
      </Badge>
      <Badge variant="destructive">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
        Offline
      </Badge>
    </div>
  ),
};
