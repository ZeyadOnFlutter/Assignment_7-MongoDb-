import { ObjectId } from 'mongodb';
import { successResponse } from '../../Common/Utils/Response/success.response.js';
import { db } from '../../DB/connection.js';
import {
  BadRequestException,
  InternalServerException,
} from '../../Common/Exceptions/error.exception.js';
import { logSchema } from '../../DB/models/log.model.js';

export const createLogsCollection = async (req, res) => {
  try {
    const logCollection = await db.command({
      create: 'logs',
      capped: true,
      size: 1000000,
      validator: { $jsonSchema: logSchema },
    });
    return successResponse(res, 201, 'done', logCollection);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};

export const insertLog = async (req, res) => {
  try {
    const { book_id, action } = req.body;
    if (!book_id || !action) {
      throw BadRequestException({
        message: 'book_id and action are required',
        options: { cause: { status: 400, errors: ['book_id and action are required'] } },
      });
    }
    if (!ObjectId.isValid(book_id)) {
      throw BadRequestException({
        message: 'book_id must be a valid ObjectId',
        options: { cause: { status: 400, errors: ['book_id must be a valid ObjectId'] } },
      });
    }
    if (!['borrowed', 'returned'].includes(action)) {
      throw BadRequestException({
        message: 'action must be either borrowed or returned',
        options: { cause: { status: 400, errors: ['action must be either borrowed or returned'] } },
      });
    }
    const log = await db.collection('logs').insertOne({ book_id: new ObjectId(book_id), action });
    return successResponse(res, 201, 'done', log);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
