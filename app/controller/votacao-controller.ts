import { VotacaoRepository } from "../repositories/votacao-repository";
import { VotacaoService } from "../services/votacao-service";


const votacaoRepository = new VotacaoRepository();
const votacaoService = new VotacaoService(votacaoRepository);

export class VotacaoController {
  async findAll() {
    return votacaoService.findAll();
  }

  async findById(id: string) {
    return votacaoService.findById(id);
  }
}