import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

export default async function TagsPage() {
  const tags = await payload.find({
    collection: 'tags',
    limit: 0,
    depth: 0,
  })
  return (
    <div>
      <h1>Tags</h1>
      <ul>
        {tags.docs.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
    </div>
  )
}
