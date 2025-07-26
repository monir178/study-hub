import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your StudyHub account",
};

export default async function SignUpPage() {
  const session = await auth();

  // Redirect if already authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-2">
            Join StudyHub and start your learning journey
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
