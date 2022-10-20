Приложение "Библиотека" с использованием express.js

Документ коллекции books
{
title: "string",
description: "string",
authors: "string"
}

Запрос для вставки данных минимум о двух книгах в коллекцию books:
db.books.insertMany([
{
title: "titleBook1",
description: "descriptionBook1",
authors: "authorsBook1"
},
{
title: "titleBook2",
description: "descriptionBook2",
authors: "authorsBook2"
}
])

Запрос для поиска полей документов коллекции books по полю title:
db.books.find( {title: "titleBook1"} )

Запрос для редактирования полей: description и authors коллекции books по \_id записи:
db.books.updateOne(
{"\_id": 1},
{$set: {description: "descriptionBookAnother", authors: "authorsBookAnother}}
)
