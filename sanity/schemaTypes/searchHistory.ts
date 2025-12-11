import { defineField, defineType } from "sanity";

export const searchHistory = defineType({
  name: 'searchHistory',
  type: 'document',
  title: 'Search History',
  fields: [
    defineField({
      name: 'user',
      type: 'reference',
      title: 'User',
      to: [{ type: 'user' }],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'city',
      type: 'string',
      title: 'City',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'searchedAt',
      type: 'datetime',
      title: 'Searched At',
      validation: (Rule: any) => Rule.required(),
    })
  ],
})