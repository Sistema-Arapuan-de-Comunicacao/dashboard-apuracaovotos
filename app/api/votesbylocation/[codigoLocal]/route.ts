import { NextRequest, NextResponse } from "next/server"
import { VotacaoController } from "@/app/controller/votacao-controller"

const controller = new VotacaoController()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigoLocal: string }> }
) {
  const { codigoLocal } = await params

  const ranking = await controller.findByLocation(codigoLocal)

  return NextResponse.json(ranking)
}
