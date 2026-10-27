import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('veterinarios')

export default function Page() {
  return <BusinessSectorPage slug="veterinarios" />
}
