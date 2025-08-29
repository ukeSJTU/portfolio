import { faker } from '@faker-js/faker'
import type { Payload } from 'payload'

/**
 * Seeds the tags collection with predefined and random tags
 */
export const seedTags = async (payload: Payload, count: number = 10): Promise<void> => {
  const collectionName = 'tags'

  try {
    console.log(`Seeding ${collectionName}...`)

    const predefinedTags = [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'Machine Learning',
      'Web Development',
      'Data Science',
      'Algorithm',
      'Database',
      'Cloud Computing',
      'Cybersecurity',
    ]

    // Determine how many tags to create
    const tagsToCreate = Math.min(count, predefinedTags.length)
    let created = 0

    // Create predefined tags first
    for (let i = 0; i < tagsToCreate; i++) {
      await payload.create({
        collection: collectionName,
        data: {
          name: predefinedTags[i],
        },
      })
      created++
    }

    // Create additional random tags if needed
    const remainingCount = count - created
    if (remainingCount > 0) {
      console.log(`  Creating ${remainingCount} additional random tags`)

      for (let i = 0; i < remainingCount; i++) {
        const tagName = faker.helpers.arrayElement([
          faker.hacker.noun(),
          faker.commerce.productAdjective(),
          faker.science.chemicalElement().name,
          faker.color.human(),
        ])

        await payload.create({
          collection: collectionName,
          data: {
            name: `${tagName}-${faker.string.alphanumeric(3)}`, // Add suffix to avoid duplicates
          },
        })
        created++
      }
    }

    console.log(`  Successfully seeded ${created} tags`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`  Failed to seed ${collectionName}: ${message}`)
    throw error
  }
}
