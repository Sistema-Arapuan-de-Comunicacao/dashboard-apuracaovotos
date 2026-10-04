import { VotacaoRepository } from "../repositories/votacao-repository"
import { VotacaoService } from "../services/votacao-service"
import type { RankingVote, VotesResponse } from "@/lib/types/vote"

const votacaoRepository = new VotacaoRepository()
const votacaoService = new VotacaoService(votacaoRepository)

function serializeRanking(
  ranking: Awaited<ReturnType<VotacaoService["findAll"]>>
): RankingVote[] {
  return ranking.map((item) => ({
    ...item,
    total_votos: Number(item.total_votos),
    total_votos_cargo: Number(item.total_votos_cargo),
    posicao: Number(item.posicao),
  }))
}

function getTotalVotes(ranking: RankingVote[]) {
  const totalsByOffice = new Map<string, number>()

  for (const item of ranking) {
    totalsByOffice.set(item.codigo_cargo, item.total_votos_cargo)
  }

  return Array.from(totalsByOffice.values()).reduce(
    (total, officeTotal) => total + officeTotal,
    0
  )
}

export class VotacaoController {
  async findAll() {
    const result = await votacaoService.findAll()

    return serializeRanking(result)
  }

  async findByLocation(localId: number): Promise<VotesResponse> {
    const ranking = serializeRanking(
      await votacaoService.findByLocation(localId)
    )

    return {
      votos: ranking,
      total_geral_votos: getTotalVotes(ranking),
    }
  }

  async findById(id: string) {
    return votacaoService.findById(id)
  }
}
