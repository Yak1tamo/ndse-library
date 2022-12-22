import { injectable } from "inversify";
import "reflect-metadata"
import { BookDb } from '../models/bookdb.js'
// import { IBook } from '../interfaces/IBook.js'

@injectable()
export class BooksRepository {
	async createBook(newBook: any) {
		try {
			return await newBook.save()
		} catch (e) {
			console.log(e)
		}
	}

	async getBook(id: string) {
		try {
			return await BookDb.findById(id)
		} catch (e) {
			console.log(e)
		}
	}

	async getBooks() {
		try {
			return await BookDb.find()
		} catch (e) {
			console.log(e)
		}
	}

	async updateBook(id: string, params: any): Promise<void> {
		try {
			await BookDb.findByIdAndUpdate(id, params)
		} catch (e) {
			console.log(e)
		}
	}

	async deleteBook(id: string): Promise<void> {
		try {
			await BookDb.deleteOne({_id: id})
		} catch (e) {
			console.log(e)
		}
	}
}
