import 'server-only'
import { revalidatePath } from 'next/cache'

export function revalidateBusiness(slug: string) {
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/businesses')
  revalidatePath(`/dashboard/businesses/${slug}`, 'layout')
  revalidatePath(`/w/${slug}`)
  revalidatePath('/w/domain/[hostname]', 'page')
}
