import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/NavBar";
import { isAdminEmail } from "@/lib/admin";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("pseudo")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        pseudo={profile?.pseudo ?? user.email ?? ""}
        isAdmin={isAdminEmail(user.email)}
      />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
