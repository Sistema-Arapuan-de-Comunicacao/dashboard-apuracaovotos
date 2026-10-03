import { VotacaoRepository } from "../repositories/votacao-repository";


export class VotacaoService {
  constructor(
    private readonly votacaoRepository: VotacaoRepository,
  ) {}

  async findAll() {
    return this.votacaoRepository.findAll();
  }

  async findById(id: string) {
    const votacao = await this.votacaoRepository.findById(Number(id));

    if (!votacao) {
      throw new Error("Votação not found");
    }

    return votacao;
  }
}