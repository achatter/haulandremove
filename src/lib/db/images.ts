import { createClient } from '@/lib/supabase/server'
import type { BusinessImage } from '@/types'

export async function getImagesForBusiness(businessId: string): Promise<BusinessImage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('business_images')
    .select('*')
    .eq('business_id', businessId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data as BusinessImage[]) ?? []
}

export function getPrimaryImage(images: BusinessImage[]): BusinessImage | undefined {
  return images.find((img) => img.is_primary) ?? images[0]
}
