import { defineField, defineType } from "sanity";

export const visitedRestaurant = defineType({
  name: 'visitedRestaurant',
  type: 'document',
  title: 'Visited Restaurant',
  fields: [
    defineField({
      name: 'user',
      type: 'reference',
      title: 'User',
      to: [{ type: 'user' }],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'placeId',
      type: 'string',
      title: 'Google Place ID',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Restaurant Name',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'address',
      type: 'string',
      title: 'Address',
    }),
    defineField({
      name: 'visitedAt',
      type: 'datetime',
      title: 'Visited At',
    }),
  ],
})