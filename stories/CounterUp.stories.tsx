import type { Meta, StoryObj } from "@storybook/nextjs";
import { CounterUp } from "@/components/ui/counter-up";

const meta: Meta<typeof CounterUp> = {
  title: "UI/CounterUp",
  component: CounterUp,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    end: 100,
    duration: 2000,
  },
};

export const LargeNumber: Story = {
  args: {
    end: 1000000,
    duration: 3000,
  },
};

export const WithDecimals: Story = {
  args: {
    end: 99.99,
    duration: 2000,
    decimals: 2,
  },
};

export const FastAnimation: Story = {
  args: {
    end: 50,
    duration: 500,
  },
};
