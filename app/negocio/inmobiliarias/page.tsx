import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('inmobiliarias')

export default function Page() {
  return <BusinessSectorPage slug="inmobiliarias" />
}
