import { User } from '@/lib/data'

interface Props {
  user: User | null
  size?: number
}

export default function Avatar({ user, size = 40 }: Props) {
  const initials = (user?.nome ?? '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {user?.foto
        ? <img src={user.foto} alt={user.nome} />
        : initials}
    </div>
  )
}
