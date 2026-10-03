import { UserRound } from "lucide-react"

import { ElectionCharts } from "@/components/election-charts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { type Candidate, candidates } from "@/lib/data/candidate"
import { votationLocations } from "@/lib/data/votation-location"
import Image from "next/image"

type Office = {
  title: string;
  candidates: Candidate[];
  size: "lg" | "sm";
}

const offices: Office[] = [
  { title: "Presidente", candidates: candidates.slice(0, 3), size: "lg" },
  { title: "Governador", candidates: candidates.slice(0, 3), size: "lg" },
  { title: "Deputado Federal", candidates: candidates.slice(0, 5), size: "sm" },
  { title: "Deputado Estadual", candidates: candidates.slice(0, 5), size: "sm" },
  { title: "Senador", candidates: candidates.slice(0, 5), size: "sm" },
]

export default function Page() {
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
        >
          {offices.map((office, index) => (
            <Card
              key={office.title}
              className={index < 2 ? "xl:col-span-3" : "xl:col-span-2"}
            >
              <CardHeader>
                <CardTitle>{office.title}</CardTitle>
                <CardDescription>Resultados parciais</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5">
                {office.candidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} size={office.size} />
                ))}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="w-full" aria-label="Gráficos da apuração">
          <ElectionCharts />
        </section>

        <section className="w-full" aria-label="Locais de votação">
          <Card>
            <CardHeader>
              <CardTitle>Locais de votação</CardTitle>
              <CardDescription>
                Distribuição dos locais de votação no mapa
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[70vh] min-h-80 overflow-hidden px-2">
              <Map center={[-34.8990014, -7.1069417]} zoom={11}>
                {votationLocations.map((location) => (
                  <MapMarker
                    key={location.id}
                    longitude={location.longitude}
                    latitude={location.latitude}
                  >
                    <MarkerContent>
                      <div className="size-4 rounded-full border-2 border-white bg-primary shadow-lg" />
                    </MarkerContent>
                    <MarkerTooltip>{location.localVotacao}</MarkerTooltip>
                  </MapMarker>
                ))}
              </Map>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  )
}

type CandidateCardProps = {
  candidate: Candidate;
  size: "lg" | "sm";
}

function CandidateCard({
  candidate: { nomeUrnaCandidato, nomePartido, numeroCandidato },
}: CandidateCardProps) {
  return (
    <Card size="sm" className="gap-3 px-3 py-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground sm:size-11">
          <UserRound className="size-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <CardTitle className="truncate">{nomeUrnaCandidato}</CardTitle>
          <CardDescription className="truncate">
            {nomePartido} • {numeroCandidato}
          </CardDescription>
        </div>
      </div>

      <Progress value={56} className="w-full gap-2">
        <ProgressLabel className="text-xs sm:text-sm">
          Porcentagem de votos
        </ProgressLabel>
        <ProgressValue className="text-xs sm:text-sm" />
      </Progress>
    </Card>
  )
}
