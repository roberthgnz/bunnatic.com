import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('gimnasios')

export default function Page() {
  return <BusinessSectorPage slug="gimnasios" />
}
