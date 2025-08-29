import { faker } from '@faker-js/faker'
import type { Payload } from 'payload'

/**
 * Seeds the courses collection with predefined and random courses
 * Requires schools to exist first
 */
export const seedCourses = async (payload: Payload, count: number = 8): Promise<void> => {
  const collectionName = 'courses'

  try {
    console.log(`Seeding ${collectionName}...`)

    // Get existing schools for relationships
    const schoolsResult = await payload.find({
      collection: 'schools',
      limit: 100,
    })

    if (schoolsResult.docs.length === 0) {
      throw new Error('No schools found. Please seed schools first.')
    }

    const predefinedCourses = [
      'Introduction to Computer Science',
      'Data Structures and Algorithms',
      'Machine Learning',
      'Web Development',
      'Database Systems',
      'Software Engineering',
      'Artificial Intelligence',
      'Computer Networks',
      'Operating Systems',
      'Cybersecurity',
      'Mobile App Development',
      'Cloud Computing',
    ]

    let created = 0

    for (let i = 0; i < count; i++) {
      // Use predefined course names first, then generate random ones
      const courseName =
        predefinedCourses[i] ||
        faker.helpers.arrayElement([
          `Advanced ${faker.hacker.noun()}`,
          `Introduction to ${faker.science.chemicalElement().name}`,
          `${faker.commerce.productAdjective()} ${faker.hacker.noun()}`,
          `${faker.company.buzzNoun()} Systems`,
        ])

      // Randomly assign to a school
      const randomSchool = faker.helpers.arrayElement(schoolsResult.docs)

      await payload.create({
        collection: collectionName,
        data: {
          name: courseName,
          school: randomSchool.id,
        },
      })
      created++
    }

    console.log(`  Successfully seeded ${created} courses`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`  Failed to seed ${collectionName}: ${message}`)
    throw error
  }
}
