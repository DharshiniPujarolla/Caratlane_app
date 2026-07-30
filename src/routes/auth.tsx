import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { actions } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Luméa Fine Jewellery" },
      {
        name: "description",
        content: "Sign in or create a Luméa account to track orders, save wishlists and earn rewards.",
      },
      { property: "og:title", content: "Sign in — Luméa Fine Jewellery" },
      { property: "og:description", content: "Sign in to track orders and save your wishlist." },
    ],
  }),
  component: Auth,
});

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (mode === "forgot") {
      toast.success("Reset link sent to your email");
      setMode("login");
      return;
    }
    if (!email) return toast.error("Enter your email");
    actions.signIn(name || "Aditi Rao", email);
    toast.success(mode === "login" ? "Welcome back" : "Account created");
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="gradient-primary px-6 pb-10 pt-14 text-primary-foreground">
        <h1 className="text-2xl font-semibold tracking-[0.2em]">LUMÉA</h1>
        <p className="mt-2 text-xs opacity-85">
          {mode === "signup"
            ? "Create your account for rewards & faster checkout."
            : mode === "forgot"
              ? "We'll email you a secure reset link."
              : "Sign in to continue shopping fine jewellery."}
        </p>
      </div>

      <div className="-mt-6 flex-1 rounded-t-3xl bg-background px-6 pt-6">
        {mode !== "forgot" && (
          <div className="mb-6 flex rounded-full bg-muted p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 rounded-full py-2 text-[13px] font-semibold transition-all",
                  mode === m ? "bg-card text-primary shadow-soft" : "text-muted-foreground",
                )}
              >
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {mode === "signup" && <Field label="Full name" value={name} onChange={setName} />}
          <Field label="Email address" type="email" value={email} onChange={setEmail} />
          {mode !== "forgot" && (
            <Field label="Password" type="password" value={password} onChange={setPassword} />
          )}
        </div>

        {mode === "login" && (
          <button
            onClick={() => setMode("forgot")}
            className="mt-2 text-[12px] font-medium text-primary"
          >
            Forgot password?
          </button>
        )}

        <button
          onClick={submit}
          className="press mt-6 w-full rounded-xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-card"
        >
          {mode === "login" ? "Login" : mode === "signup" ? "Create Account" : "Send reset link"}
        </button>

        {mode !== "forgot" && (
          <>
            <div className="my-5 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or continue with{" "}
              <span className="h-px flex-1 bg-border" />
            </div>
            <button
              onClick={() => {
                actions.signIn("Aditi Rao", "aditi@gmail.com");
                toast.success("Signed in with Google");
                navigate({ to: "/" });
              }}
              className="press w-full rounded-xl border border-border bg-card py-3.5 text-sm font-semibold"
            >
              Continue with Google
            </button>
            <button
              onClick={() => {
                actions.signIn("Guest", "guest@lumea.com", true);
                navigate({ to: "/" });
              }}
              className="press mt-3 w-full rounded-xl py-3 text-sm font-semibold text-primary"
            >
              Continue as Guest
            </button>
          </>
        )}

        {mode === "forgot" && (
          <button
            onClick={() => setMode("login")}
            className="press mt-3 w-full py-3 text-sm font-semibold text-primary"
          >
            Back to login
          </button>
        )}
      </div>
    </div>
  );
}
