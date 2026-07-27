"use client";

import { SignUp } from "@clerk/nextjs";
import { useLanguage } from "@/components/LanguageContext";

export default function SignUpPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-16">
      <SignUp />
      <p className="max-w-sm text-center text-xs text-[#3A4A42]/70">
        {t(
          "Keinen Code erhalten? Bitte auch im Spam- bzw. Junk-Ordner nachsehen — manchmal verirrt sich die E-Mail dorthin.",
          "Didn't get a code? Please also check your spam/junk folder — the email sometimes ends up there."
        )}
      </p>
    </div>
  );
}
