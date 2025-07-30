import { SoundTest } from "@/components/debug/SoundTest";

export default function TestSoundsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sound System Test</h1>
        <div className="grid gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Timer Sounds</h2>
            <SoundTest />
          </div>
        </div>

        <div className="mt-8 bg-muted/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Instructions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Click "Sound Effects" to enable/disable sounds</li>
            <li>• Test each sound button to hear the different timer sounds</li>
            <li>• Test each sound button to hear the different timer sounds</li>
            <li>
              • The system uses fallback Web Audio API sounds if MP3 files are
              not found
            </li>
            <li>
              • Sounds are saved to localStorage and persist between sessions
            </li>
            <li>
              • Each sound has a different frequency to distinguish actions
            </li>
            <li>
              •{" "}
              <strong>
                Sound effects play for timer actions (start, pause, reset,
                complete)
              </strong>
            </li>
          </ul>
        </div>

        <div className="mt-6 bg-muted/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Sound Frequencies</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Timer Start</p>
              <p className="text-muted-foreground">
                E5 (659.25 Hz) - High, energetic
              </p>
            </div>
            <div>
              <p className="font-medium">Timer Pause</p>
              <p className="text-muted-foreground">
                A4 (440 Hz) - Medium, calm
              </p>
            </div>
            <div>
              <p className="font-medium">Timer Reset</p>
              <p className="text-muted-foreground">
                F4 (349.23 Hz) - Low, grounding
              </p>
            </div>
            <div>
              <p className="font-medium">Timer Complete</p>
              <p className="text-muted-foreground">
                C5 (523.25 Hz) - Clear, attention-grabbing
              </p>
            </div>
            <div>
              <p className="font-medium">Phase Change</p>
              <p className="text-muted-foreground">
                D5 (587.33 Hz) - Transitional
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
