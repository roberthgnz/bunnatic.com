import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('esteticas')

export default function Page() {
  return <BusinessSectorPage slug="esteticas" />
}
