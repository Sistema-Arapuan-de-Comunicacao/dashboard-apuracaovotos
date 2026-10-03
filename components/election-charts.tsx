"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

const chartData = [
  {
    cargo: "Presidente",
    candidato1: 246420,
    candidato2: 277185,
    candidato3: 112640,
  },
  {
    cargo: "Governador",
    candidato1: 248730,
    candidato2: 194550,
    candidato3: 98210,
  },
  {
    cargo: "Dep. Federal",
    candidato1: 168920,
    candidato2: 124310,
    candidato3: 91870,
    candidato4: 91870,
    candidato5: 91870,
  },
  {
    cargo: "Dep. Estadual",
    candidato1: 142680,
    candidato2: 108240,
    candidato3: 81950,
    candidato4: 81950,
    candidato5: 81950,
  },
  {
    cargo: "Senador",
    candidato1: 201840,
    candidato2: 173760,
    candidato3: 112980,
    candidato4: 112980,
    candidato5: 112980,
  },
]

const chartConfig = {
  candidato1: {
    label: "Candidato 1",
    color: "var(--chart-1)",
  },
  candidato2: {
    label: "Candidato 2",
    color: "var(--chart-2)",
  },
  candidato3: {
    label: "Candidato 3",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const compactNumberFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function ElectionCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votos por cargo</CardTitle>
        <CardDescription>
          Comparativo dos três candidatos mais votados em cada cargo
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
            <Bar
              dataKey="candidato1"
              fill="var(--color-candidato1)"
              radius={4}
            />
            <Bar
              dataKey="candidato2"
              fill="var(--color-candidato2)"
              radius={4}
            />
            <Bar
              dataKey="candidato3"
              fill="var(--color-candidato3)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
