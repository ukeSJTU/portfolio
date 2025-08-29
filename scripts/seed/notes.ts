import { faker } from '@faker-js/faker'
import type { Payload } from 'payload'

/**
 * Seeds the notes collection with random notes
 * Requires courses and tags to exist first
 */
export const seedNotes = async (payload: Payload, count: number = 15): Promise<void> => {
  const collectionName = 'notes'

  try {
    console.log(`Seeding ${collectionName}...`)

    // Get existing courses and tags for relationships
    const [coursesResult, tagsResult] = await Promise.all([
      payload.find({
        collection: 'courses',
        limit: 100,
      }),
      payload.find({
        collection: 'tags',
        limit: 100,
      }),
    ])

    if (coursesResult.docs.length === 0) {
      throw new Error('No courses found. Please seed courses first.')
    }

    if (tagsResult.docs.length === 0) {
      throw new Error('No tags found. Please seed tags first.')
    }

    let created = 0

    for (let i = 0; i < count; i++) {
      // Generate title and slug
      const title = faker.helpers.arrayElement([
        `Understanding ${faker.hacker.noun()}`,
        `Introduction to ${faker.science.chemicalElement().name}`,
        `Advanced ${faker.company.buzzNoun()} Concepts`,
        `${faker.commerce.productAdjective()} ${faker.hacker.noun()} Techniques`,
        `Building ${faker.commerce.productName()} Systems`,
        `${faker.hacker.verb()} with ${faker.hacker.noun()}`,
        `Best Practices for ${faker.company.buzzNoun()}`,
        `Deep Dive into ${faker.science.chemicalElement().name}`,
      ])

      const slug = title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .substring(0, 50) // Limit slug length

      // Select random relationships
      const status = faker.helpers.arrayElement(['draft', 'published', 'archived'])
      const randomCourse = faker.helpers.arrayElement(coursesResult.docs)
      const numberOfTagsToSelect = faker.number.int({
        min: 1,
        max: Math.min(4, tagsResult.docs.length),
      })
      const selectedTags = faker.helpers
        .arrayElements(tagsResult.docs, numberOfTagsToSelect)
        .map((tag) => tag.id)

      // Build note data
      const noteData: any = {
        title,
        slug: `${slug}-${faker.string.alphanumeric(4)}`, // Add suffix to avoid duplicates
        status,
        course: randomCourse.id,
        isFeatured: faker.datatype.boolean(0.2),
        excerpt: faker.lorem.sentences(2, ' '),
        tags: selectedTags,
        viewCount: faker.number.int({ min: 0, max: 1000 }),
        syncWithGithub: faker.datatype.boolean(0.3),
      }

      // Add optional fields conditionally
      if (noteData.syncWithGithub && faker.datatype.boolean(0.7)) {
        noteData.githubUrl = `https://github.com/example/repo/blob/main/${noteData.slug}.md`
      }

      if (faker.datatype.boolean(0.4)) {
        noteData.metaTitle = title
      }

      if (faker.datatype.boolean(0.4)) {
        noteData.metaDescription = faker.lorem.sentence()
      }

      await payload.create({
        collection: collectionName,
        data: noteData,
      })
      created++
    }

    console.log(`  Successfully seeded ${created} notes`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`  Failed to seed ${collectionName}: ${message}`)
    throw error
  }
}
