"use client"

import { useMemo, useRef, useState } from "react"
import { Building2, MapPin, Navigation, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  type MapRef,
} from "@/components/ui/map"
import { type VotationLocation } from "@/lib/data/votation-location"
import { cn } from "@/lib/utils"

type CustomMapProps = {
  votationLocations: VotationLocation[]
}

type RankingEntry = {
  name: string
  party: string
  votes: number
  percentage: number
}

type OfficeRanking = {
  office: string
  entries: RankingEntry[]
}

const cities = [
  {
    name: "João Pessoa",
    center: [-34.8829, -7.1195] as [number, number],
    zoom: 11.5,
  },
  {
    name: "Campina Grande",
    center: [-35.8811, -7.2306] as [number, number],
    zoom: 12,
  },
]

const officeCandidates = [
  {
    office: "Presidente",
    limit: 3,
    candidates: [
      ["Marina Andrade", "PDB"],
      ["Carlos Nogueira", "UPN"],
      ["Rafael Martins", "FBR"],
    ],
  },
  {
    office: "Senador",
    limit: 3,
    candidates: [
      ["Lívia Monteiro", "PDB"],
      ["Augusto Lima", "UPN"],
      ["Teresa Farias", "MVP"],
    ],
  },
  {
    office: "Governador",
    limit: 5,
    candidates: [
      ["Eduardo Ribeiro", "FBR"],
      ["Sofia Cavalcanti", "PDB"],
      ["André Bezerra", "UPN"],
      ["Helena Torres", "MVP"],
      ["Paulo Vasconcelos", "PRS"],
    ],
  },
  {
    office: "Deputado Federal",
    limit: 5,
    candidates: [
      ["Clara Menezes", "PDB"],
      ["João Azevedo", "UPN"],
      ["Bruno Dantas", "FBR"],
      ["Ana Lins", "MVP"],
      ["Felipe Moura", "PRS"],
    ],
  },
  {
    office: "Deputado Estadual",
    limit: 5,
    candidates: [
      ["Camila Freire", "UPN"],
      ["Lucas Tavares", "PDB"],
      ["Beatriz Melo", "FBR"],
      ["Diego Pessoa", "PRS"],
      ["Renata Queiroz", "MVP"],
    ],
  },
] as const

const numberFormatter = new Intl.NumberFormat("pt-BR")

function getMockRankings(location: VotationLocation): OfficeRanking[] {
  const seed = location.id
  const estimatedValidVotes = Math.round(
    location.totalEleitores * (0.7 + (seed % 13) / 100)
  )
  const baseShares = [0.36, 0.27, 0.18, 0.1, 0.05]

  return officeCandidates.map(({ office, limit, candidates }, officeIndex) => {
    const entries = candidates.slice(0, limit).map(([name, party], index) => {
      const variation =
        (((seed * (index + 3) + officeIndex * 11) % 9) - 4) / 100
      const share = Math.max(baseShares[index] + variation, 0.03)
      const votes = Math.round(estimatedValidVotes * share)

      return {
        name,
        party,
        votes,
        percentage: (votes / estimatedValidVotes) * 100,
      }
    })

    return { office, entries: entries.sort((a, b) => b.votes - a.votes) }
  })
}

export function CustomMap({ votationLocations }: CustomMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [selectedLocation, setSelectedLocation] =
    useState<VotationLocation | null>(null)

  const rankings = useMemo(
    () => (selectedLocation ? getMockRankings(selectedLocation) : []),
    [selectedLocation]
  )

  function resizeAndFlyTo(center: [number, number], zoom: number) {
    window.requestAnimationFrame(() => {
      mapRef.current?.resize()
      mapRef.current?.flyTo({ center, zoom, duration: 1100 })
    })
  }

  function selectLocation(location: VotationLocation) {
    setSelectedLocation(location)
    resizeAndFlyTo([location.longitude, location.latitude], 15)
  }

  function goToCity(center: [number, number], zoom: number) {
    setSelectedLocation(null)
    resizeAndFlyTo(center, zoom)
  }

  function closeDetails() {
    setSelectedLocation(null)
    window.requestAnimationFrame(() => mapRef.current?.resize())
  }

  return (
    <Card>
      <CardHeader className="gap-4 lg:grid-cols-[1fr_auto]">
        <div className="space-y-1">
          <CardTitle>Locais de votação</CardTitle>
          <CardDescription>
            Selecione um marcador para consultar o ranking de votos do local
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Atalhos de cidades">
          {cities.map((city) => (
            <Button
              key={city.name}
              type="button"
              variant="outline"
              onClick={() => goToCity(city.center, city.zoom)}
            >
              <Navigation aria-hidden="true" />
              {city.name}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-[80vh] min-h-[640px] overflow-hidden px-2">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border lg:flex-row">
          {selectedLocation && (
            <aside
              key="details"
              className="flex h-[55%] min-h-0 w-full shrink-0 flex-col border-b bg-background lg:h-full lg:min-w-1/2 lg:basis-1/2 lg:border-r lg:border-b-0"
              aria-label={`Resultados de ${selectedLocation.localVotacao}`}
            >
              <LocationResults
                location={selectedLocation}
                rankings={rankings}
                onClose={closeDetails}
              />
            </aside>
          )}

          <div key="map" className="relative min-h-0 min-w-0 flex-1">
            <Map ref={mapRef} center={[-34.8990014, -7.1069417]} zoom={11}>
              <MapControls position="bottom-right" showZoom />

              {votationLocations.map((location) => {
                const isSelected = selectedLocation?.id === location.id

                return (
                  <MapMarker
                    key={location.id}
                    longitude={location.longitude}
                    latitude={location.latitude}
                    onClick={() => selectLocation(location)}
                  >
                    <MarkerContent>
                      <button
                        type="button"
                        aria-label={`Ver resultados de ${location.localVotacao}`}
                        aria-pressed={isSelected}
                        className={cn(
                          "relative flex size-6 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                          isSelected && "scale-125 ring-4 ring-primary/25"
                        )}
                      >
                        <MapPin className="size-3.5" aria-hidden="true" />
                      </button>
                    </MarkerContent>
                    <MarkerTooltip>{location.localVotacao}</MarkerTooltip>
                  </MapMarker>
                )
              })}
            </Map>

            {!selectedLocation && (
              <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
                <div className="flex items-center gap-2 rounded-full border bg-background/95 px-3 py-2 text-xs text-foreground shadow-lg backdrop-blur-sm sm:text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  Clique em um local para ver os votos
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type LocationResultsProps = {
  location: VotationLocation
  rankings: OfficeRanking[]
  onClose: () => void
}

function LocationResults({
  location,
  rankings,
  onClose,
}: LocationResultsProps) {
  return (
    <>
      <div className="border-b p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {location.municipio} · Zona {location.zona}
            </p>
            <h3 className="mt-1 text-base leading-snug font-semibold sm:text-lg">
              {location.localVotacao}
            </h3>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar resultados do local"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-muted/60 p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-4" aria-hidden="true" />
              Eleitores
            </div>
            <p className="mt-1 font-semibold">
              {numberFormatter.format(location.totalEleitores)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-muted-foreground">Seções</p>
            <p className="mt-1 font-semibold">
              {location.secoesPrincipais.length}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold">Ranking de votos</h4>
            <p className="text-xs text-muted-foreground">
              Apuração por cargo neste local
            </p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium whitespace-nowrap text-secondary-foreground">
            Dados simulados
          </span>
        </div>

        <div className="space-y-5">
          {rankings.map((ranking) => (
            <section
              key={ranking.office}
              aria-label={`Ranking para ${ranking.office}`}
            >
              <h5 className="mb-2 text-sm font-semibold">{ranking.office}</h5>

              <ol className="divide-y rounded-lg border">
                {ranking.entries.map((entry, index) => (
                  <li
                    key={`${ranking.office}-${entry.name}`}
                    className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                        index === 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {entry.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.party}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">
                        {numberFormatter.format(entry.votes)}
                      </p>
                      <p className="flex items-center justify-end text-xs text-muted-foreground tabular-nums">
                        {entry.percentage.toFixed(1).replace(".", ",")}%
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
