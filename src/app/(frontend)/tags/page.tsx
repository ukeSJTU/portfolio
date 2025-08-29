import { TagsClient } from '@/components/tags-client'
import config from '@payload-config'
import { getPayload } from 'payload'

export default async function TagsPage() {
  const payload = await getPayload({ config })

  const tags = await payload.find({
    collection: 'tags',
    limit: 0,
    depth: 1,
  })

  return <TagsClient tags={tags.docs} />
}
