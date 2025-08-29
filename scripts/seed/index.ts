import { faker } from '@faker-js/faker'
import config from '@payload-config'
import { Command } from 'commander'
import path from 'path'
import { getPayload } from 'payload'

import { seedCourses } from './courses'
import { seedNotes } from './notes'
import { seedSchools } from './schools'
import { seedTags } from './tags'
import { seedUsers } from './users'

// Load environment variables
// dotenv.config({
//   path: path.resolve(process.cwd(), '.env'),
// })

// Setup command line interface
const program = new Command()

program
  .name('seed')
  .description('Seed the database with sample data')
  .version('1.0.0')
  .option('-c, --clear', 'Clear existing data before seeding', false)
  .option('-u, --users <count>', 'Number of random users to create', '5')
  .option('-t, --tags <count>', 'Number of tags to create', '10')
  .option('-s, --schools <count>', 'Number of schools to create', '5')
  .option('--courses <count>', 'Number of courses to create', '8')
  .option('-n, --notes <count>', 'Number of notes to create', '15')
  .option('--seed <number>', 'Seed number for consistent results', process.env.SEED_NUMBER || '42')

program.parse()

const options = program.opts()

// Convert string options to numbers
const seedOptions = {
  clear: options.clear,
  users: parseInt(options.users, 10),
  tags: parseInt(options.tags, 10),
  schools: parseInt(options.schools, 10),
  courses: parseInt(options.courses, 10),
  notes: parseInt(options.notes, 10),
  seed: parseInt(options.seed, 10),
}

// Validate options
const validateOptions = (opts: typeof seedOptions) => {
  const errors: string[] = []

  if (isNaN(opts.users) || opts.users < 0) errors.push('users must be a non-negative number')
  if (isNaN(opts.tags) || opts.tags < 0) errors.push('tags must be a non-negative number')
  if (isNaN(opts.schools) || opts.schools < 0) errors.push('schools must be a non-negative number')
  if (isNaN(opts.courses) || opts.courses < 0) errors.push('courses must be a non-negative number')
  if (isNaN(opts.notes) || opts.notes < 0) errors.push('notes must be a non-negative number')
  if (isNaN(opts.seed)) errors.push('seed must be a valid number')

  if (errors.length > 0) {
    console.error('Invalid options:')
    errors.forEach((error) => console.error(`  - ${error}`))
    process.exit(1)
  }
}

const seed = async (): Promise<void> => {
  try {
    console.log('Environment check:')
    console.log(`  NODE_ENV: ${process.env.NODE_ENV}`)
    console.log(`  PAYLOAD_SECRET exists: ${!!process.env.PAYLOAD_SECRET}`)
    console.log(`  PAYLOAD_SECRET length: ${process.env.PAYLOAD_SECRET?.length || 0}`)
    console.log(`  Current working directory: ${process.cwd()}`)
    console.log(`  .env file path: ${path.resolve(process.cwd(), '.env')}`)

    console.log('Starting database seeding...')

    validateOptions(seedOptions)

    console.log('Starting database seeding...')
    console.log(`Configuration:`)
    console.log(`  Clear database: ${seedOptions.clear}`)
    console.log(`  Seed number: ${seedOptions.seed}`)
    console.log(`  Users: ${seedOptions.users}`)
    console.log(`  Tags: ${seedOptions.tags}`)
    console.log(`  Schools: ${seedOptions.schools}`)
    console.log(`  Courses: ${seedOptions.courses}`)
    console.log(`  Notes: ${seedOptions.notes}`)

    // Set faker seed for consistent results
    faker.seed(seedOptions.seed)
    console.log('Faker seed configured')

    const payload = await getPayload({
      config: config,
    })

    console.log('Connected to Payload')

    // Clear existing data if requested
    if (seedOptions.clear) {
      console.log('Clearing existing data...')

      // Clear in reverse dependency order to avoid foreign key constraints
      await payload.delete({ collection: 'notes', where: {} })
      console.log('  Cleared notes')

      await payload.delete({ collection: 'courses', where: {} })
      console.log('  Cleared courses')

      await payload.delete({ collection: 'schools', where: {} })
      console.log('  Cleared schools')

      await payload.delete({ collection: 'tags', where: {} })
      console.log('  Cleared tags')

      await payload.delete({ collection: 'users', where: {} })
      console.log('  Cleared users')

      console.log('Database cleared successfully')
    }

    // Seed data in dependency order
    console.log('Creating seed data...')
    await seedUsers(payload, seedOptions.users)
    await seedTags(payload, seedOptions.tags)
    await seedSchools(payload, seedOptions.schools)
    await seedCourses(payload, seedOptions.courses)
    await seedNotes(payload, seedOptions.notes)

    console.log('Database seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// Run the seed function
seed()
