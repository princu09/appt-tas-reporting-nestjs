import { Controller, Get, HttpException } from '@nestjs/common';
import { getConnectionManager } from 'typeorm';
import { createClient } from 'redis';

@Controller('ping')
export class PingController {
  @Get()
  async ping() {
    // check DB Connection
    const cm = getConnectionManager();
    if (!cm.connections.length || !cm.connections[0].isConnected)
      throw new HttpException('No database connection', 555);

    const client = createClient({
      url: process.env.REDIS_USER
        ? `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    try {
      await client.connect();
      await client.disconnect();
    } catch (err) {
      throw new HttpException('No database connection', 556);
    }
  }
}
