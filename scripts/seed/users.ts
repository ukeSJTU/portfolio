import { faker } from '@faker-js/faker'
import type { Payload } from 'payload'

/**
 * Seeds the users collection with admin and random users
 */
export const seedUsers = async (payload: Payload, count: number = 5): Promise<void> => {
  const collectionName = 'users'

  try {
    console.log(`Seeding ${collectionName}...`)

    // Create admin user from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123'

    console.log(`  Creating admin user (${adminEmail})`)
    await payload.create({
      collection: collectionName,
      data: {
        email: adminEmail,
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
      },
    })

    // Create random users
    if (count > 0) {
      console.log(`  Creating ${count} random users`)

      for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const email = faker.internet.email({ firstName, lastName })

        const userData = {
          email,
          password: 'password123',
          firstName,
          lastName,
        }

        await payload.create({
          collection: collectionName,
          data: userData,
        })
      }
    }

    const total = count + 1 // +1 for admin user
    console.log(`  Successfully seeded ${total} users`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`  Failed to seed ${collectionName}: ${message}`)
    throw error
  }
}
