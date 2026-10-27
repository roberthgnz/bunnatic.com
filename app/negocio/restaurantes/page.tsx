import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('restaurantes')

export default function Page() {
  return <BusinessSectorPage slug="restaurantes" />
}
