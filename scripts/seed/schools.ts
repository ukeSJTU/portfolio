import { faker } from '@faker-js/faker'
import type { Payload } from 'payload'

/**
 * Seeds the schools collection with predefined and random schools
 */
export const seedSchools = async (payload: Payload, count: number = 5): Promise<void> => {
  const collectionName = 'schools'

  try {
    console.log(`Seeding ${collectionName}...`)

    const predefinedSchools = [
      'Stanford University',
      'Massachusetts Institute of Technology',
      'Harvard University',
      'University of California, Berkeley',
      'Carnegie Mellon University',
      'University of Oxford',
      'University of Cambridge',
      'ETH Zurich',
      'Shanghai Jiao Tong University',
      'Tsinghua University',
    ]

    // Determine how many schools to create
    const schoolsToCreate = Math.min(count, predefinedSchools.length)
    let created = 0

    // Create predefined schools first
    for (let i = 0; i < schoolsToCreate; i++) {
      await payload.create({
        collection: collectionName,
        data: {
          name: predefinedSchools[i],
        },
      })
      created++
    }

    // Create additional random schools if needed
    const remainingCount = count - created
    if (remainingCount > 0) {
      console.log(`  Creating ${remainingCount} additional random schools`)

      for (let i = 0; i < remainingCount; i++) {
        const city = faker.location.city()
        const type = faker.helpers.arrayElement([
          'University',
          'College',
          'Institute of Technology',
          'Technical University',
          'School of Engineering',
        ])

        const schoolName = `${city} ${type}`

        await payload.create({
          collection: collectionName,
          data: {
            name: schoolName,
          },
        })
        created++
      }
    }

    console.log(`  Successfully seeded ${created} schools`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`  Failed to seed ${collectionName}: ${message}`)
    throw error
  }
}
