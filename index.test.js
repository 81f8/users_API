// FILEPATH: /C:/Users/salam/Desktop/aun/week6/users_api/index.test.js

const request = require('supertest');
const express = require('express');
const fs = require('fs');
const app = require('./index'); // Assuming your Express app is exported from index.js

jest.mock('fs');

describe('GET /users', () => {
  it('should return all users when no filters are applied', async () => {
    const users = [
      { id: 1, name: 'John', age: 25 },
      { id: 2, name: 'Jane', age: 30 },
      { id: 3, name: 'Bob', age: 25 },
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(users));

    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(users);
  });

  it('should return filtered users when filters are applied', async () => {
    const users = [
      { id: 1, name: 'John', age: 25, city: 'New York' },
      { id: 2, name: 'Jane', age: 30, city: 'London' },
      { id: 3, name: 'Bob', age: 25, city: 'New York' },
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(users));

    const res = await request(app).get('/users').query({ age: 25, city: 'New York' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      { id: 1, name: 'John', age: 25, city: 'New York' },
      { id: 3, name: 'Bob', age: 25, city: 'New York' },
    ]);
  });
});

describe('POST /users', () => {
  it('should add a new user and return success message', async () => {
    const users = [
      { id: 1, name: 'John', age: 25 },
      { id: 2, name: 'Jane', age: 30 },
      { id: 3, name: 'Bob', age: 25 },
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(users));
    fs.writeFileSync.mockImplementation(() => {});

    const newUser = { name: 'Alice', age: 20 };
    const res = await request(app).post('/users').send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ message: 'success', user: { id: 4, ...newUser } });
  });
});

describe('GET /users/:id', () => {
  it('should return the user with the given id', async () => {
    const users = [
      { id: 1, name: 'John', age: 25 },
      { id: 2, name: 'Jane', age: 30 },
      { id: 3, name: 'Bob', age: 25 },
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(users));

    const res = await request(app).get('/users/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(users[0]);
  });
});