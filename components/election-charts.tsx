"use client"

import {
  Bar,
  BarChart,
  type BarShapeProps,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
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
import type { RankingVote } from "@/lib/types/vote"

const officeOrder = ["1", "3", "6", "7", "5"]

const officeLabels: Record<string, string> = {
  "1": "Presidente",
  "3": "Governador",
  "5": "Senador",
  "6": "Dep. Federal",
  "7": "Dep. Estadual",
}

const officeLimits: Record<string, number> = {
  "1": 3,
  "3": 3,
  "5": 4,
  "6": 5,
  "7": 5,
}

const chartConfig = {
  candidato1: { label: "1º colocado", color: "var(--chart-1)" },
  candidato2: { label: "2º colocado", color: "var(--chart-2)" },
  candidato3: { label: "3º colocado", color: "var(--chart-3)" },
  candidato4: { label: "4º colocado", color: "var(--chart-4)" },
  candidato5: { label: "5º colocado", color: "var(--chart-5)" },
} satisfies ChartConfig

const compactNumberFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
})

type ChartRow = {
  cargo: string
  codigoCargo: string
  [key: string]: string | number
}

type ElectionChartsProps = {
  votes: RankingVote[]
  isLoading?: boolean
}

const barGap = 4

function CenteredBar({ payload, width, x, ...props }: BarShapeProps) {
  const shouldCenter =
    payload?.codigoCargo === "1" || payload?.codigoCargo === "3"
  const centeredX = shouldCenter ? x + width + barGap : x

  return <Rectangle {...props} x={centeredX} width={width} />
}

export function ElectionCharts({ votes, isLoading }: ElectionChartsProps) {
  const chartData = officeOrder.map((officeCode) => {
    const row: ChartRow = {
      cargo: officeLabels[officeCode],
      codigoCargo: officeCode,
    }

    for (const vote of votes.filter(
      (item) =>
        item.codigo_cargo === officeCode &&
        item.posicao <= officeLimits[officeCode],
    )) {
      row[`candidato${vote.posicao}`] = vote.total_votos
    }

    return row
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votos por cargo</CardTitle>
        <CardDescription>
          {isLoading
            ? "Carregando votos do banco de dados…"
            : "Comparativo dos candidatos mais votados em cada cargo"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[360px] w-full"
          initialDimension={{ width: 900, height: 360 }}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            barGap={barGap}
            margin={{ left: 0, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="cargo"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              tickFormatter={(value) => compactNumberFormatter.format(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatter={(value, name) => (
                    <div className="flex min-w-36 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {Number(value).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map((candidateKey) => (
              <Bar
                key={candidateKey}
                dataKey={candidateKey}
                fill={`var(--color-${candidateKey})`}
                radius={4}
                shape={CenteredBar}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
