import { prisma } from "@/lib/prisma"

export interface RankingCandidato {
  candidato_id: number
  nome_candidato: string
  nome_urna_candidato: string
  nome_partido: string
  numero_candidato: string
  codigo_cargo: string
  nome_cargo: string
  total_votos: bigint
  total_votos_cargo: bigint
  posicao: bigint
}

export class VotacaoRepository {
  async findAll(): Promise<RankingCandidato[]> {
    return prisma.$queryRaw<RankingCandidato[]>`

      WITH votos_por_candidato AS (

        SELECT
          c.id AS candidato_id,
          c.nome_candidato,
          c.nome_urna_candidato,
          c.nome_partido,
          c.numero_candidato,
          ca.codigo_cargo,
          ca.nome_cargo,
          SUM(v.qtd_votos) AS total_votos

        FROM votos v

        INNER JOIN candidatos c
          ON c.id = v.fk_idcandidato

        INNER JOIN cargos ca
          ON ca.id = c.fk_idcargo

        GROUP BY
          c.id,
          c.nome_candidato,
          c.nome_urna_candidato,
          c.nome_partido,
          c.numero_candidato,
          ca.codigo_cargo,
          ca.nome_cargo
      ),

      ranking AS (

        SELECT
          *,
          (SUM(total_votos) OVER (
            PARTITION BY codigo_cargo
          ))::bigint AS total_votos_cargo,
          ROW_NUMBER() OVER (
            PARTITION BY codigo_cargo
            ORDER BY total_votos DESC
          ) AS posicao

        FROM votos_por_candidato
      )

      SELECT
        candidato_id,
        nome_candidato,
        nome_urna_candidato,
        nome_partido,
        numero_candidato,
        codigo_cargo,
        nome_cargo,
        total_votos,
        total_votos_cargo,
        posicao

      FROM ranking

      WHERE
        (codigo_cargo = '1' AND posicao <= 5)
        OR
        (codigo_cargo = '3' AND posicao <= 5)
        OR
        (codigo_cargo = '5' AND posicao <= 4)
        OR
        (codigo_cargo = '6' AND posicao <= 7)
        OR
        (codigo_cargo = '7' AND posicao <= 7)

      ORDER BY
        CASE codigo_cargo
          WHEN '1' THEN 1
          WHEN '3' THEN 2
          WHEN '5' THEN 3
          WHEN '7' THEN 4
          WHEN '6' THEN 5
        END,
        posicao
    `
  }

  async findByLocal(localId: number): Promise<RankingCandidato[]> {
    return prisma.$queryRaw<RankingCandidato[]>`

      WITH votos_por_candidato AS (

        SELECT
          c.id AS candidato_id,
          c.nome_candidato,
          c.nome_urna_candidato,
          c.nome_partido,
          c.numero_candidato,
          ca.codigo_cargo,
          ca.nome_cargo,
          SUM(v.qtd_votos) AS total_votos

        FROM votos v

        INNER JOIN candidatos c
          ON c.id = v.fk_idcandidato

        INNER JOIN cargos ca
          ON ca.id = c.fk_idcargo

        INNER JOIN local_votacao lv
          ON lv.id = v.fk_idlocal_votacao

        WHERE lv.id = ${localId}

        GROUP BY
          c.id,
          c.nome_candidato,
          c.nome_urna_candidato,
          c.nome_partido,
          c.numero_candidato,
          ca.codigo_cargo,
          ca.nome_cargo
      ),

      ranking AS (

        SELECT
          *,
          (SUM(total_votos) OVER (
            PARTITION BY codigo_cargo
          ))::bigint AS total_votos_cargo,
          ROW_NUMBER() OVER (
            PARTITION BY codigo_cargo
            ORDER BY total_votos DESC
          ) AS posicao

        FROM votos_por_candidato
      )

      SELECT
        candidato_id,
        nome_candidato,
        nome_urna_candidato,
        nome_partido,
        numero_candidato,
        codigo_cargo,
        nome_cargo,
        total_votos,
        total_votos_cargo,
        posicao

      FROM ranking

      WHERE
        (codigo_cargo = '1' AND posicao <= 5)
        OR
        (codigo_cargo = '3' AND posicao <= 5)
        OR
        (codigo_cargo = '5' AND posicao <= 4)
        OR
        (codigo_cargo = '6' AND posicao <= 7)
        OR
        (codigo_cargo = '7' AND posicao <= 7)

      ORDER BY
        CASE codigo_cargo
          WHEN '1' THEN 1
          WHEN '3' THEN 2
          WHEN '5' THEN 3
          WHEN '7' THEN 4
          WHEN '6' THEN 5
        END,
        posicao
    `
  }

  async findById(id: number) {
    return prisma.votos.findUnique({
      where: { id },
    })
  }
}
