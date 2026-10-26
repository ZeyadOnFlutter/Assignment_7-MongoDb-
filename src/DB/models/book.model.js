export const bookSchema = {
  required: ['title', 'author', 'year', 'genres'],
  properties: {
    title: {
      bsonType: 'string',
      minLength: 3,
      maxLength: 20,
      description: 'title length must be over 3 and under 20 and is required and must be a string',
    },
    author: {
      bsonType: 'string',
      minLength: 3,
      maxLength: 20,
      description: 'author length must be over 3 and under 20 and is required and must be a string',
    },
    year: {
      bsonType: 'int',
      minimum: 1000,
      maximum: 2026,
      description: 'year must be an integer in the range 1000-2023 and is required',
    },
    genres: {
      bsonType: 'array',
      items: {
        bsonType: 'string',
      },
      description: 'must be an array of strings',
    },
  },
};
