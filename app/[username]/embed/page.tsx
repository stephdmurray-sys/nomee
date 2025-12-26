import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function EmbedNomeePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle()

  if (!profile || profile.plan !== "premier") {
    notFound()
  }

  const { data: contributions } = await supabase
    .from("contributions")
    .select(`
      *,
      contribution_traits (
        trait_id,
        rank,
        trait_library (
          id,
          label,
          category
        )
      )
    `)
    .eq("profile_id", profile.id)
    .eq("is_featured", true)
    .eq("status", "confirmed")
    .order("created_at", { ascending: false })

  const featuredContributions = contributions || []

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Compact Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-900">{profile.full_name}</h1>
        {profile.headline && <p className="text-base text-neutral-600">{profile.headline}</p>}
      </div>

      {/* Featured Perspectives */}
      {featuredContributions.length > 0 ? (
        <div className="space-y-4">
          {featuredContributions.map((contribution) => {
            const traits =
              contribution.contribution_traits?.map((ct: any) => ct.trait_library?.label).filter(Boolean) || []

            return (
              <Card key={contribution.id} className="p-6 bg-neutral-50 border border-neutral-200">
                <p className="mb-4 text-base leading-relaxed text-neutral-900">{contribution.message}</p>
                {traits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {traits.map((trait: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="border-t pt-3 text-sm">
                  <div className="font-medium text-neutral-900">{contribution.contributor_name}</div>
                  <div className="text-neutral-500">
                    {contribution.relationship} · {contribution.company_or_org}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-neutral-600">No featured perspectives yet.</p>
        </Card>
      )}

      {/* Powered by footer */}
      <div className="mt-8 text-center">
        <a
          href="https://www.nomee.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-400 hover:text-neutral-600"
        >
          Powered by Nomee
        </a>
      </div>
    </div>
  )
}
