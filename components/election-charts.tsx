"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const lineData = [
  { horario: "17:00", candidato1: 32, candidato2: 41, candidato3: 27 },
  { horario: "17:30", candidato1: 35, candidato2: 39, candidato3: 26 },
  { horario: "18:00", candidato1: 38, candidato2: 38, candidato3: 24 },
  { horario: "18:30", candidato1: 41, candidato2: 37, candidato3: 22 },
  { horario: "19:00", candidato1: 43, candidato2: 36, candidato3: 21 },
  { horario: "19:30", candidato1: 45, candidato2: 35, candidato3: 20 },
]

const radarData = [
  { regiao: "Mata", candidato1: 78, candidato2: 62, candidato3: 45 },
  { regiao: "Agreste", candidato1: 68, candidato2: 75, candidato3: 52 },
  { regiao: "Borborema", candidato1: 58, candidato2: 70, candidato3: 66 },
  { regiao: "Sertão", candidato1: 72, candidato2: 55, candidato3: 74 },
]

type ElectionChartsProps = {
  candidateNames: [string, string, string]
}

export function ElectionCharts({ candidateNames }: ElectionChartsProps) {
  const chartConfig = {
    candidato1: {
      label: candidateNames[0],
      color: "var(--chart-1)",
    },
    candidato2: {
      label: candidateNames[1],
      color: "var(--chart-2)",
    },
    candidato3: {
      label: candidateNames[2],
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Evolução da apuração</CardTitle>
          <CardDescription>Percentual de votos por horário</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
            initialDimension={{ width: 600, height: 280 }}
          >
            <LineChart
              accessibilityLayer
              data={lineData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="horario"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="candidato1"
                type="natural"
                stroke="var(--color-candidato1)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="candidato2"
                type="natural"
                stroke="var(--color-candidato2)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="candidato3"
                type="natural"
                stroke="var(--color-candidato3)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por região</CardTitle>
          <CardDescription>Comparativo regional dos candidatos</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[280px]"
            initialDimension={{ width: 420, height: 280 }}
          >
            <RadarChart accessibilityLayer data={radarData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis dataKey="regiao" />
              <PolarGrid />
              <Radar
                dataKey="candidato1"
                fill="var(--color-candidato1)"
                fillOpacity={0.6}
              />
              <Radar
                dataKey="candidato2"
                fill="var(--color-candidato2)"
                fillOpacity={0.4}
              />
              <Radar
                dataKey="candidato3"
                fill="var(--color-candidato3)"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
