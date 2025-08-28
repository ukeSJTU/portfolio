import type { CollectionConfig } from 'payload'

export const Schools: CollectionConfig = {
  slug: 'schools',
  fields: [
    {
      name: 'name',
      label: 'School Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'logo',
      label: 'School Logo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
