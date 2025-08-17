import type { Meta, StoryObj } from "@storybook/nextjs";
import { Separator } from "@/components/ui/separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium leading-none">Next.js</h4>
        <p className="text-sm text-muted-foreground">
          The React Framework for Production.
        </p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="space-y-1 w-[200px]">
      <div className="px-2 py-1.5 text-sm font-medium">Navigation</div>
      <Separator />
      <div className="px-2 py-1.5 text-sm">Dashboard</div>
      <div className="px-2 py-1.5 text-sm">Settings</div>
      <div className="px-2 py-1.5 text-sm">Profile</div>
      <Separator />
      <div className="px-2 py-1.5 text-sm text-red-600">Logout</div>
    </div>
  ),
};
