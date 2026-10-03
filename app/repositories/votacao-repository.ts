import { prisma } from "@/lib/prisma";

export class VotacaoRepository {
  async findAll() {
    return prisma.votos.findMany();
  }

  async findById(id: number) {
    return prisma.votos.findUnique({
      where: { id },
    });
  }
}