export type RankingVote = {
  candidato_id: number
  nome_candidato: string
  nome_urna_candidato: string
  nome_partido: string
  numero_candidato: string
  codigo_cargo: string
  nome_cargo: string
  total_votos: number
  total_votos_cargo: number
  posicao: number
}

export type VotesResponse = {
  votos: RankingVote[]
  total_geral_votos: number
}
