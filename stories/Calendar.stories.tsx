import type { Meta, StoryObj } from "@storybook/nextjs";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
} as unknown as Story;

export const Range: Story = {
  args: {},
  render: () => {
    const [dateRange, setDateRange] = useState<any>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const handleSelect = (range: any) => {
      setDateRange(range);
    };

    return (
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={handleSelect}
        className="rounded-md border"
      />
    );
  },
} as unknown as Story;

export const Multiple: Story = {
  args: {},
  render: () => {
    const [dates, setDates] = useState<Date[]>([]);

    const handleSelect = (selectedDates: any) => {
      setDates(selectedDates || []);
    };

    return (
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={handleSelect}
        className="rounded-md border"
      />
    );
  },
} as unknown as Story;
