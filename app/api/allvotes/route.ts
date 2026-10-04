import { NextResponse } from "next/server"
import { VotacaoController } from "@/app/controller/votacao-controller"

const controller = new VotacaoController()

export async function GET() {
  try {
    const votes = await controller.findAll()

    return NextResponse.json(votes, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch {
    return NextResponse.json(
      { message: "Não foi possível consultar os votos." },
      { status: 500 }
    )
  }
}
