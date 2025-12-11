import { type SchemaTypeDefinition } from 'sanity'
import { user } from './user'
import { searchHistory } from './searchHistory'
import { favoriteRestaurant } from './favoriteRestaurant'
import { visitedRestaurant } from './visitedRestaurant'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ user, searchHistory, favoriteRestaurant, visitedRestaurant],
}
