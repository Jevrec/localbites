import { defineField, defineType } from "sanity";

export const favoriteRestaurant = defineType({
  name: 'favoriteRestaurant',
  type: 'document',
  title: 'Favorite Restaurant',
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
      name: 'savedAt',
      type: 'datetime',
      title: 'Saved At',
      validation: (Rule: any) => Rule.required(),
    }),
  ],
})