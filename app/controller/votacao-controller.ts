import { VotacaoRepository } from "../repositories/votacao-repository"
import { VotacaoService } from "../services/votacao-service"

const votacaoRepository = new VotacaoRepository()
const votacaoService = new VotacaoService(votacaoRepository)

export class VotacaoController {
  async findAll() {
    const result = await votacaoService.findAll()

    const response = result.map((item) => ({
      ...item,
      total_votos: Number(item.total_votos),
      posicao: Number(item.posicao),
    }))

    return response
  }

  async findByLocation(codigo_local: string) {
    const ranking = await votacaoService.findByLocation(codigo_local)

    return ranking.map((item) => ({
      ...item,
      total_votos: Number(item.total_votos),
      posicao: Number(item.posicao),
    }))
  }

  async findById(id: string) {
    return votacaoService.findById(id)
  }
}
