import { successResponse } from '../../Common/Utils/Response/success.response.js';
import { db } from '../../DB/connection.js';
import { InternalServerException } from '../../Common/Exceptions/error.exception.js';

export const createAuthorsCollection = async (req, res) => {
  try {
    const result = await db.collection('Authors').insertOne({
      name: 'John Doe',
      nationality: 'American',
      birthYear: 1970,
    });
    return successResponse(res, 201, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
