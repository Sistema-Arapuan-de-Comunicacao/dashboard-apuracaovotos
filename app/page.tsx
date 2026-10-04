"use client"

import { UserRound } from "lucide-react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

import { ElectionCharts } from "@/components/election-charts"
import { CustomMap } from "@/components/map-component"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { fetchAllVotes } from "@/lib/api/votes"
import { votationLocations } from "@/lib/data/votation-location"
import type { RankingVote } from "@/lib/types/vote"

type OfficeConfig = {
  code: string
  title: string
  limit: number
  size: "lg" | "sm"
}

const offices: OfficeConfig[] = [
  { code: "1", title: "Presidente", limit: 3, size: "lg" },
  { code: "3", title: "Governador", limit: 3, size: "lg" },
  { code: "6", title: "Deputado Federal", limit: 5, size: "sm" },
  { code: "7", title: "Deputado Estadual", limit: 5, size: "sm" },
  { code: "5", title: "Senador", limit: 5, size: "sm" },
]

const numberFormatter = new Intl.NumberFormat("pt-BR")

export default function Page() {
  const votesQuery = useQuery({
    queryKey: ["votes", "all"],
    queryFn: fetchAllVotes,
    refetchInterval: 1_500,
    refetchIntervalInBackground: true,
  })

  const votes = votesQuery.data ?? []

  return (
    <>
      <header
        className="flex min-h-28 w-full items-center justify-center bg-cover px-4 py-6"
        style={{
          backgroundImage: "url('/FUNDO2K_BandEleicoes2026.png')",
          backgroundPosition: "center 85%",
        }}
      >
        <Image
          src="/LOGO 2026.png"
          alt="Arapuan Eleições 2026"
          width={372}
          height={155}
          preload
          unoptimized
          className="h-auto w-40 sm:w-52"
        />
      </header>

      <main className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <section
          className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-6"
          aria-label="Resultados por cargo"
          aria-busy={votesQuery.isPending}
        >
          {votesQuery.isError && votes.length === 0 ? (
            <Card className="md:col-span-2 xl:col-span-6">
              <CardHeader>
                <CardTitle>Resultados indisponíveis</CardTitle>
                <CardDescription>
                  {votesQuery.error.message} Uma nova tentativa será feita
                  automaticamente.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            offices.map((office, index) => {
              const candidates = votes
                .filter((vote) => vote.codigo_cargo === office.code)
                .slice(0, office.limit)

              return (
                <Card
                  key={office.code}
                  className={index < 2 ? "xl:col-span-3" : "xl:col-span-2"}
                >
                  <CardHeader>
                    <CardTitle>{office.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2.5">
                    {candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.candidato_id}
                        candidate={candidate}
                        size={office.size}
                      />
                    ))}

                    {!votesQuery.isPending && candidates.length === 0 && (
                      <p className="py-4 text-sm text-muted-foreground">
                        Nenhum voto contabilizado para este cargo.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </section>

        <section className="w-full" aria-label="Gráficos da apuração">
          <ElectionCharts votes={votes} isLoading={votesQuery.isPending} />
        </section>

        <section className="w-full" aria-label="Locais de votação">
          <CustomMap votationLocations={votationLocations} />
        </section>
      </main>
    </>
  )
}

type CandidateCardProps = {
  candidate: RankingVote
  size: "lg" | "sm"
}

function CandidateCard({ candidate, size }: CandidateCardProps) {
  const percentage = candidate.total_votos_cargo
    ? (candidate.total_votos / candidate.total_votos_cargo) * 100
    : 0

  return (
    <Card size="sm" className="gap-3 px-3 py-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground sm:size-11">
          <UserRound className="size-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <CardTitle className="truncate">
            {candidate.nome_urna_candidato}
          </CardTitle>
          <CardDescription className="truncate">
            {candidate.nome_partido} • {candidate.numero_candidato}
          </CardDescription>
        </div>

        <span
          className={
            size === "lg"
              ? "text-base font-semibold tabular-nums sm:text-lg"
              : "text-sm font-semibold tabular-nums"
          }
        >
          {numberFormatter.format(candidate.total_votos)}
        </span>
      </div>

      <Progress value={percentage} className="w-full gap-2">
        <ProgressLabel className="text-xs sm:text-sm">
          {candidate.posicao}º lugar
        </ProgressLabel>
        <ProgressValue className="text-xs sm:text-sm" />
      </Progress>
    </Card>
  )
}
