import { UserStateDemo } from "@/components/debug/UserStateDemo";

export default function UserTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">User State Management Test</h1>
      <div className="max-w-md mx-auto">
        <UserStateDemo />
      </div>
    </div>
  );
}
