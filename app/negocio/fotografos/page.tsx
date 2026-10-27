import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('fotografos')

export default function Page() {
  return <BusinessSectorPage slug="fotografos" />
}
