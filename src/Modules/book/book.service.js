import { ObjectId, Int32 } from 'mongodb';
import { successResponse } from '../../Common/Utils/Response/success.response.js';
import { db } from '../../DB/connection.js';
import {
  BadRequestException,
  InternalServerException,
} from '../../Common/Exceptions/error.exception.js';
import { bookSchema } from '../../DB/models/book.model.js';

export const createBookCollection = async (req, res) => {
  try {
    const bookCollection = await db.createCollection('Books', {
      validator: {
        $jsonSchema: bookSchema,
      },
    });
    return successResponse(res, 201, 'done');
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const createBookTitleIndex = async (req, res) => {
  try {
    const titleIndex = await db.collection('Books').createIndex({ title: 1 }, { unique: true });
    return successResponse(res, 201, 'done', titleIndex);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const insertOneBook = async (req, res) => {
  try {
    const { title, author, year, genres } = req.body;
    if (!title || !author || !year || !genres) {
      throw BadRequestException({
        message: 'title,author,year,genres are required',
        options: { cause: { status: 400, errors: ['title,author,year,genres are required'] } },
      });
    }
    if (title.length < 3 || title.length > 20 || author.length < 3 || author.length > 20) {
      throw BadRequestException({
        message: 'title,author must be bigger than three and smaller than 20',
        options: {
          cause: {
            status: 400,
            errors: ['title,author must be bigger than three and smaller than 20'],
          },
        },
      });
    }
    if (year < 1000 || year > 2023 || isNaN(parseInt(year))) {
      throw BadRequestException({
        message: 'year must be a number between 1000 and 2023',
        options: {
          cause: { status: 400, errors: ['year must be a number between 1000 and 2023'] },
        },
      });
    }
    if (
      !Array.isArray(genres) ||
      genres.some((genre) => typeof genre !== 'string') ||
      genres.length === 0
    ) {
      throw BadRequestException({
        message: 'Invalid genres',
        options: {
          cause: { status: 400, errors: ['Invalid genres'] },
        },
      });
    }
    const book = await db.collection('Books').insertOne(req.body);
    return successResponse(res, 201, 'done', book);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const insertManyBooks = async (req, res) => {
  try {
    const books = req.body;
    if (!books) {
      throw BadRequestException({
        message: 'books are required',
        options: { cause: { status: 400, errors: ['books are required'] } },
      });
    }
    if (!Array.isArray(books) || books.length < 3) {
      throw BadRequestException({
        message: 'At least 3 books are required',
        options: { cause: { status: 400, errors: ['At least 3 books are required'] } },
      });
    }
    if (books.length > 3) {
      throw BadRequestException({
        message: 'Maximum 3 books allowed',
        options: { cause: { status: 400, errors: ['Maximum 3 books allowed'] } },
      });
    }
    for (const { title, author, year, genres } of books) {
      if (!title || !author || !year || !genres) {
        throw BadRequestException({
          message: 'title,author,year,genres are required',
          options: { cause: { status: 400, errors: ['title,author,year,genres are required'] } },
        });
      }
      if (title.length < 3 || title.length > 20 || author.length < 3 || author.length > 20) {
        throw BadRequestException({
          message: 'title,author must be bigger than three and smaller than 20',
          options: {
            cause: {
              status: 400,
              errors: ['title,author must be bigger than three and smaller than 20'],
            },
          },
        });
      }
      if (year < 1000 || year > 2026 || isNaN(parseInt(year))) {
        throw BadRequestException({
          message: 'year must be a number between 1000 and 2026',
          options: {
            cause: { status: 400, errors: ['year must be a number between 1000 and 2026'] },
          },
        });
      }
      if (
        !Array.isArray(genres) ||
        genres.some((g) => typeof g !== 'string') ||
        genres.length === 0
      ) {
        throw BadRequestException({
          message: 'Invalid genres',
          options: { cause: { status: 400, errors: ['Invalid genres'] } },
        });
      }
    }
    const result = await db.collection('Books').insertMany(books);
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
export const updateBookByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    if (!title || title.length < 3 || title.length > 20) {
      throw BadRequestException({
        message: 'title must be bigger than three and smaller than 20',
        options: {
          cause: { status: 400, errors: ['title must be bigger than three and smaller than 20'] },
        },
      });
    }
    const result = await db.collection('Books').updateOne({ title }, { $set: { year: 2022 } });
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const findABookWithTitle = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title || title.length < 3 || title.length > 20) {
      throw BadRequestException({
        message: 'title must be bigger than three and smaller than 20',
        options: {
          cause: { status: 400, errors: ['title must be bigger than three and smaller than 20'] },
        },
      });
    }
    const result = await db.collection('Books').findOne({ title });
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const findBooksByYearRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to || isNaN(parseInt(from)) || isNaN(parseInt(to))) {
      throw BadRequestException({
        message: 'from and to must be valid numbers',
        options: { cause: { status: 400, errors: ['from and to must be valid numbers'] } },
      });
    }
    const result = await db
      .collection('Books')
      .find({ year: { $gte: parseInt(from), $lte: parseInt(to) } })
      .toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const findBooksByGenre = async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) {
      throw BadRequestException({
        message: 'genre is required',
        options: { cause: { status: 400, errors: ['genre is required'] } },
      });
    }
    const result = await db
      .collection('Books')
      .find({ genres: { $in: [genre] } })
      .toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const findBooksWithSkipLimit = async (req, res) => {
  try {
    const result = await db
      .collection('Books')
      .find()
      .sort({ year: -1 })
      .skip(2)
      .limit(3)
      .toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const findBooksByYearInteger = async (req, res) => {
  try {
    const result = await db
      .collection('Books')
      .find({ year: { $type: 'int' } })
      .toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const findBooksExcludeGenres = async (req, res) => {
  try {
    const result = await db
      .collection('Books')
      .find({ genres: { $nin: ['Horror', 'Science Fiction'] } })
      .toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const deleteBooksBefore2000 = async (req, res) => {
  try {
    const result = await db.collection('Books').deleteMany({ year: { $lt: 2000 } });
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const aggregateFilterAndSort = async (req, res) => {
  try {
    const result = await db
      .collection('Books')
      .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }])
      .toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const aggregateProjection = async (req, res) => {
  try {
    const result = await db.collection('Books').aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { _id: 0, title: 1, author: 1, year: 1 } },
    ]).toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const aggregateUnwindGenres = async (req, res) => {
  try {
    const result = await db.collection('Books').aggregate([
      { $unwind: '$genres' },
    ]).toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
export const aggregateLookup = async (req, res) => {
  try {
    const result = await db.collection('Books').aggregate([
      {
        $lookup: {
          from: 'logs',
          localField: '_id',
          foreignField: 'book_id',
          as: 'logs',
        },
      },
    ]).toArray();
    return successResponse(res, 200, 'done', result);
  } catch (error) {
    throw error.cause
      ? error
      : InternalServerException({
          message: error.message,
          options: { cause: { status: 500, errors: [error.message] } },
        });
  }
};
