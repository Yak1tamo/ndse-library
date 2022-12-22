import 'reflect-metadata';
import { Container } from 'inversify';

import { BooksRepository } from './services/BooksRepository.js';

const container = new Container();

container.bind(BooksRepository).toSelf();

export { container };
