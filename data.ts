// ──────────────────────────────────────────────────────────────────────────────
//  TIPOS
// ──────────────────────────────────────────────────────────────────────────────
export type Role = 'adm' | 'atalaia'
export type Torre = 'Oração' | 'Adoração'
export type Dia = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo'
export type PresStatus = 'presente' | 'faltou' | 'vago' | ''

export interface User {
  id: number
  nome: string
  login: string
  senha: string
  role: Role
  torre: Torre | null
  dia: Dia | null
  tel: string
  foto: string
}

export interface Gideao {
  id: number
  nome: string
  tel: string
  torre: Torre
  horario: string
  dia: Dia
  semana: number
  presente: boolean
  faltou: boolean
}

export type PresencaMap = Record<string, PresStatus>

// ──────────────────────────────────────────────────────────────────────────────
//  CONSTANTES
// ──────────────────────────────────────────────────────────────────────────────
export const DIAS: Dia[] = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo']
export const TORRES: Torre[] = ['Oração','Adoração']
export const H24 = Array.from({length:24},(_,h)=>(h<10?'0':'')+h+':00')
export const SEM_LABELS = ['','1ª','2ª','3ª','4ª','5ª']

export const DEFAULT_USERS: User[] = [
  {id:0,  nome:'Administrador',   login:'admin',       senha:'admin123',  role:'adm',     torre:null,       dia:null,       tel:'',                foto:''},
  {id:1,  nome:'Ana Paula',       login:'ana.paula',   senha:'ana123',    role:'atalaia', torre:'Oração',   dia:'Terça',    tel:'(11)99001-0001',  foto:''},
  {id:2,  nome:'Pedro Alves',     login:'pedro.alves', senha:'pedro123',  role:'atalaia', torre:'Adoração', dia:'Terça',    tel:'(11)99001-0002',  foto:''},
  {id:3,  nome:'Lucas Oliveira',  login:'lucas.o',     senha:'lucas123',  role:'atalaia', torre:'Oração',   dia:'Quarta',   tel:'(11)99001-0003',  foto:''},
  {id:4,  nome:'Beatriz Santos',  login:'beatriz.s',   senha:'bea123',    role:'atalaia', torre:'Adoração', dia:'Quarta',   tel:'(11)99001-0004',  foto:''},
  {id:5,  nome:'Gustavo Lima',    login:'gustavo.l',   senha:'gus123',    role:'atalaia', torre:'Oração',   dia:'Quinta',   tel:'(11)99001-0005',  foto:''},
  {id:6,  nome:'Patrícia Moura',  login:'patricia.m',  senha:'pat123',    role:'atalaia', torre:'Adoração', dia:'Quinta',   tel:'(11)99001-0006',  foto:''},
  {id:7,  nome:'Renata Cruz',     login:'renata.c',    senha:'ren123',    role:'atalaia', torre:'Oração',   dia:'Sexta',    tel:'(11)99001-0007',  foto:''},
  {id:8,  nome:'Fábio Andrade',   login:'fabio.a',     senha:'fab123',    role:'atalaia', torre:'Adoração', dia:'Sexta',    tel:'(11)99001-0008',  foto:''},
  {id:9,  nome:'Daniel Moreira',  login:'daniel.m',    senha:'dan123',    role:'atalaia', torre:'Oração',   dia:'Sábado',   tel:'(11)99001-0009',  foto:''},
  {id:10, nome:'Camila Torres',   login:'camila.t',    senha:'cam123',    role:'atalaia', torre:'Adoração', dia:'Sábado',   tel:'(11)99001-0010',  foto:''},
  {id:11, nome:'Sônia Duarte',    login:'sonia.d',     senha:'son123',    role:'atalaia', torre:'Oração',   dia:'Domingo',  tel:'(11)99001-0011',  foto:''},
  {id:12, nome:'Eduardo Pires',   login:'eduardo.p',   senha:'edu123',    role:'atalaia', torre:'Adoração', dia:'Domingo',  tel:'(11)99001-0012',  foto:''},
  {id:13, nome:'Roberta Silva',   login:'roberta.s',   senha:'rob123',    role:'atalaia', torre:'Oração',   dia:'Segunda',  tel:'(11)99001-0013',  foto:''},
  {id:14, nome:'Marcos Cunha',    login:'marcos.c',    senha:'mar123',    role:'atalaia', torre:'Adoração', dia:'Segunda',  tel:'(11)99001-0014',  foto:''},
]

// ──────────────────────────────────────────────────────────────────────────────
//  SEED DE GIDEÕES (demo)
// ──────────────────────────────────────────────────────────────────────────────
const NAMES = [
  'Marta Souza','João Pedro','Lúcia Ferreira','Carlos Mendes','Sandra Lima',
  'Maria Clara','Débora Nunes','Rafael Costa','Fernanda Dias','Eliane Matos',
  'Rodrigo Vieira','Simone Rocha','Thiago Barbosa','Rosa Almeida','Paulo Faria',
  'Andréa Pinto','Felipe Ramos','Vanessa Teles','Henrique Braga','Juliana Freitas',
  'Cristiane Lopes','Diego Santos','Priscila Monteiro','Antônio Gomes','Leila Barbosa',
  'Samuel Cruz','Tatiane Borges','Neto Ferreira'
]

export function seedGideoes(): Gideao[] {
  const horSel = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00',
    '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
  const list: Gideao[] = []
  let id = 1
  DIAS.forEach(dia => {
    [1,2,3,4].forEach(sem => {
      TORRES.forEach(torre => {
        const qtd = 5 + Math.floor(Math.random()*5)
        const used = new Set<string>()
        for(let i=0;i<qtd;i++){
          let h: string
          do { h = horSel[Math.floor(Math.random()*horSel.length)] } while(used.has(h))
          used.add(h)
          list.push({
            id: id++,
            nome: NAMES[(id-1)%NAMES.length],
            tel: '(11)9'+String(90000000+id).slice(0,8),
            torre, horario:h, dia, semana:sem,
            presente: Math.random()>0.35,
            faltou: Math.random()<0.15
          })
        }
      })
    })
  })
  return list
}

// ──────────────────────────────────────────────────────────────────────────────
//  CHAVE localStorage
// ──────────────────────────────────────────────────────────────────────────────
export const LS_USERS   = 'toa_users'
export const LS_GIDEOES = 'toa_gideoes'
export const LS_PRES    = 'toa_pres'
