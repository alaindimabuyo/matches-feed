
import StyledComponentsRegistry from './lib/registry'
import Matches from '@/app/components/Matches'
import Layout from "@/app/layout"

export default function Home() {
  return (
    <Layout>
      <StyledComponentsRegistry>
        <Matches/>
      </StyledComponentsRegistry>
    </Layout>
  )
}
