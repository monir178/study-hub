import type { Meta, StoryObj } from "@storybook/nextjs";
import { Darkveli } from "@/components/ui/darkveli";

const meta: Meta<typeof Darkveli> = {
  title: "UI/Darkveli",
  component: Darkveli,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Darkveli Component",
  },
};

export const WithCustomProps: Story = {
  args: {
    children: "Custom Darkveli",
    className: "text-lg font-bold",
  },
};
