import { Type, Static } from '@sinclair/typebox';

export * from '../preferences/preferences.schema.js';
export * from '../users/user.schema.js';


export const SearchDBType = Type.Object({
    id: Type.String({ description: 'Unique identifier for the search result' }),
    username: Type.String({ description: 'Username of the user' })
}, {
    description: 'Schema for search results in the database',
    additionalProperties: false
});

export type SearchDBType = Static<typeof SearchDBType>;

export const SearchDBHydrateSchema = Type.Object({
    id: Type.String({ description: 'Unique identifier for the search result' }),
    username: Type.String({ description: 'Username of the user' }),
    avatar: Type.Optional(Type.String({ description: 'URL of the user\'s avatar' })),
    banner: Type.Optional(Type.String({ description: 'URL of the user\'s banner' })),
}, {
    description: 'Schema for hydrated search results with additional user information',
    additionalProperties: false
});

export type SearchDBHydrateType = Static<typeof SearchDBHydrateSchema>;

export const SearchQuerySchema = Type.Object({
    q: Type.String({ description: 'Search query string' }),
    page: Type.Optional(Type.Number({ description: 'Page number for pagination', default: 1, minimum: 1 })),
    limit: Type.Optional(Type.Number({ description: 'Number of results per page', default: 10 , minimum: 1, maximum: 100 })),
    hydrate: Type.Optional(Type.Boolean({ description: 'Whether to include additional user information', default: true }))
}, {
    description: 'Schema for search query parameters',
    additionalProperties: false
});

export type SearchQueryType = Static<typeof SearchQuerySchema>;

export const SearchResponseSchema = Type.Object({
    page: Type.Number({ description: 'Current page number' }),
    limit: Type.Number({ description: 'Number of results per page' }),
    total: Type.Number({ description: 'Total number of search results' }),
    users: Type.Array(SearchDBHydrateSchema, { description: 'Array of search results' }) 
}, {
    description: 'Schema for search response',
    additionalProperties: false
});

export type SearchResponseType = Static<typeof SearchResponseSchema>;