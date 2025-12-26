import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ContributorFlow from "./contributor-flow"

export default async function ContributePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, username")
    .eq("username", slug)
    .maybeSingle()

  console.log("[v0] Contributor page - slug:", slug, "profile:", profile, "error:", error)

  if (error || !profile) {
    console.log("[v0] Redirecting to homepage - no profile found")
    redirect("/")
  }

  return <ContributorFlow profile={profile} />
}
