"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Database } from "lucide-react";

export default function TestDbConflictsPage() {
  const [status, setStatus] = useState<string>("Ready");
  const [loading, setLoading] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);

  const testTimerOperation = async (operation: string) => {
    setLoading(true);
    setStatus(`Testing ${operation}...`);

    try {
      const response = await fetch(
        `/api/rooms/test-room-id/timer/${operation}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: "test-user-id" }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setStatus(`✅ ${operation} successful - No database conflicts`);
        setConflictCount((prev) => prev + 1);
      } else {
        setStatus(`❌ ${operation} failed: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ ${operation} error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const stressTest = async () => {
    setLoading(true);
    setStatus("Running stress test...");

    const operations = ["start", "pause", "reset"];
    let successCount = 0;
    const totalTests = 10;

    for (let i = 0; i < totalTests; i++) {
      const operation = operations[i % operations.length];

      try {
        const response = await fetch(
          `/api/rooms/test-room-id/timer/${operation}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: "test-user-id" }),
          },
        );

        const data = await response.json();

        if (data.success) {
          successCount++;
        }

        // Small delay between operations
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Operation ${operation} failed:`, error);
      }
    }

    setStatus(
      `✅ Stress test complete: ${successCount}/${totalTests} successful`,
    );
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Conflict Test</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Database Transaction Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={() => testTimerOperation("start")}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Test Start
              </Button>

              <Button
                onClick={() => testTimerOperation("pause")}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Test Pause
              </Button>

              <Button
                onClick={() => testTimerOperation("reset")}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Test Reset
              </Button>
            </div>

            <Button
              onClick={stressTest}
              disabled={loading}
              className="w-full"
              variant="secondary"
            >
              🧪 Run Stress Test (10 operations)
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <h3 className="font-semibold mb-2">Status:</h3>
                <p className="text-sm">{status}</p>
              </div>

              <div className="p-4 bg-muted/20 rounded-lg">
                <h3 className="font-semibold mb-2">Success Count:</h3>
                <p className="text-sm">{conflictCount} operations</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Tests database transaction conflict resolution</p>
              <p>• Uses retry logic with exponential backoff</p>
              <p>• Debounced saves to reduce database load</p>
              <p>• Skip countdown-only updates to prevent conflicts</p>
              <p>• Stress test runs 10 rapid operations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
