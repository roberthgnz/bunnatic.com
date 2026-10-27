import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('farmacias')

export default function Page() {
  return <BusinessSectorPage slug="farmacias" />
}
