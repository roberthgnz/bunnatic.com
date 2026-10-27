import BusinessSectorPage, {
  businessMetadata,
} from '../_components/BusinessSectorPage'

export const metadata = businessMetadata('dentistas')

export default function Page() {
  return <BusinessSectorPage slug="dentistas" />
}
