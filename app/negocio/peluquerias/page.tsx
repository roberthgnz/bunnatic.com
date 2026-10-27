import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('peluquerias')

export default function Page() {
  return <BusinessSectorPage slug="peluquerias" />
}
