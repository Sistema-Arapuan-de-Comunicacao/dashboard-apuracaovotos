import { VotacaoRepository } from "../repositories/votacao-repository";


export class VotacaoService {
  constructor(
    private readonly votacaoRepository: VotacaoRepository,
  ) {}

  async findAll() {
    return this.votacaoRepository.findAll();
  }

  async findByLocation(codigo_local: string) {
    return this.votacaoRepository.findByLocal(codigo_local);
  }

  async findById(id: string) {
    const votacao = await this.votacaoRepository.findById(Number(id));

    if (!votacao) {
      throw new Error("Votação not found");
    }

    return votacao;
  }
}