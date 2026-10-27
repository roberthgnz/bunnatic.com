import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('talleres')

export default function Page() {
  return <BusinessSectorPage slug="talleres" />
}
