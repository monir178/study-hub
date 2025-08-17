import type { Meta, StoryObj } from "@storybook/nextjs";
import { AudioPlayer } from "@/components/ui/audio-player";

const meta: Meta<typeof AudioPlayer> = {
  title: "UI/AudioPlayer",
  component: AudioPlayer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    fileName: "Sample Audio",
  },
};

export const WithCustomFileName: Story = {
  args: {
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    fileName: "My Favorite Song.wav",
  },
};

export const WithClassName: Story = {
  args: {
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    fileName: "Styled Audio Player",
    className: "border-2 border-blue-500 rounded-lg p-4",
  },
};
