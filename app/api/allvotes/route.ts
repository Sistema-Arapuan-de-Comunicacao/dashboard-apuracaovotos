import { NextResponse } from "next/server";
import { VotacaoController } from "@/app/controller/votacao-controller";

const controller = new VotacaoController();

export async function GET() {
  const votacaos = await controller.findAll();  

  return NextResponse.json(votacaos);
}