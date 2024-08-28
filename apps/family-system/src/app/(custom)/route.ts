import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  redirect('/admin')
}

export async function HEAD(request: Request) {
  redirect('/admin')
}
