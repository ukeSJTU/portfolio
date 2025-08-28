import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  fields: [
    {
      name: 'name',
      label: 'Course Name',
      type: 'text',
      required: true,
    },
    {
      name: 'school',
      label: 'School',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      hasMany: false,
    },
  ],
}
