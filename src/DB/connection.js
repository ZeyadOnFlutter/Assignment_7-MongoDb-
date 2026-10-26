import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DB_URL);
export const db = client.db(process.env.DB_NAME);

export const dbConnection = async (app, PORT) => {
  try {
    await client.connect();
    console.log('DB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to DB:', error);
    throw error;
  }
};
