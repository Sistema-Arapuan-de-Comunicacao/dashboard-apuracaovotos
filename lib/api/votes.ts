import type { RankingVote, VotesResponse } from "@/lib/types/vote"

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string
    } | null

    throw new Error(body?.message ?? "Não foi possível carregar os votos.")
  }

  return response.json() as Promise<T>
}

export function fetchAllVotes() {
  return getJson<RankingVote[]>("/api/allvotes")
}

export function fetchVotesByLocation(localId: number) {
  return getJson<VotesResponse>(`/api/votesbylocation/${localId}`)
}
