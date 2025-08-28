import type { CollectionConfig } from 'payload'

export const Notes: CollectionConfig = {
  slug: 'notes',
  labels: {
    singular: 'Note',
    plural: 'Notes',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'course',
      label: 'Course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      label: 'Featured Note',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured notes will be displayed on the homepage',
      },
    },
    {
      name: 'coverImage',
      label: 'Cover Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Brief summary for previews and SEO',
      },
    },
    {
      name: 'content',
      label: 'Content',
      type: 'richText',
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'viewCount',
      label: 'View Count',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Leave empty to generate from title',
      },
      hooks: {
        beforeValidate: [
          ({ value, originalDoc, data }) => {
            if (data?.title && !value) {
              return data.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      label: 'GitHub Sync',
      type: 'collapsible',
      fields: [
        {
          name: 'syncWithGithub',
          label: 'Sync with GitHub',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'githubUrl',
          label: 'GitHub File URL',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData.syncWithGithub,
            description: 'The URL to the file in your GitHub repository',
          },
        },
        {
          name: 'lasySync',
          label: 'Last Sync Time',
          type: 'date',
          admin: {
            readOnly: true,
            condition: (_, siblingData) => siblingData.syncWithGithub,
          },
        },
      ],
    },
    {
      label: 'SEO Settings',
      type: 'collapsible',
      fields: [
        {
          name: 'metaTitle',
          label: 'Meta Title',
          type: 'text',
          maxLength: 70,
          admin: {
            description:
              'Title for search engine results and social media. Defaults to the note title if left empty.',
          },
        },
        {
          name: 'metaDescription',
          label: 'Meta Description',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description:
              'Description for search engine results and social media. Defaults to the note excerpt if left empty.',
          },
        },
      ],
    },
  ],
}
