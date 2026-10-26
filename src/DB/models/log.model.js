export const logSchema = {
  required: ['book_id', 'action'],
  properties: {
    book_id: {
      bsonType: 'objectId',
      description: 'book_id must be an ObjectId and is required',
    },
    action: {
      bsonType: 'string',
      enum: ['borrowed', 'returned'],
      description: 'action must be either borrowed or returned and is required',
    },
  },
};
