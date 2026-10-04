import { NextResponse } from "next/server"
import { VotacaoController } from "@/app/controller/votacao-controller"

const controller = new VotacaoController()

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ localId: string }> }
) {
  const { localId: localIdParam } = await params
  const localId = Number(localIdParam)

  if (!Number.isSafeInteger(localId) || localId <= 0) {
    return NextResponse.json(
      { message: "Local de votação inválido." },
      { status: 400 }
    )
  }

  try {
    const ranking = await controller.findByLocation(localId)

    return NextResponse.json(ranking, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch {
    return NextResponse.json(
      { message: "Não foi possível consultar os votos deste local." },
      { status: 500 }
    )
  }
}
