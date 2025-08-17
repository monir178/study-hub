import type { Meta, StoryObj } from "@storybook/nextjs";
import { Loading } from "@/components/ui/loading";

const meta: Meta<typeof Loading> = {
  title: "UI/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Loading />
      <span>Loading...</span>
    </div>
  ),
};
