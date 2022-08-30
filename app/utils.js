const charactersLess = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const gameConfig = {
    numberOfTries: 6,
    hardMode: false,
}

function generateIsbn(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            characters.length));
    }
    return result;
}

function getDefaultBooks(amount) {
    const result = [];
    for (let x = 0; x < amount; x++) {
        result.push({
            id: x.toString(),
            isbn: generateIsbn(12),
            title: `Titolo libro default ${x + 1}`,
            author: `Autore libro default ${x + 1}`,
            description: `Descrizione libro default ${x + 1}`,
            coverImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbmpkg-KZ4ezscypPhu3nnrNHwP4WYlTJEkQ&usqp=CAU',
        });
    }
    return result;
}

function getPaginatedBooks(allBooks, booksPerPage) {
    const result = [];
    for (let i = 0; i < allBooks.length; i += booksPerPage) {
        const chunk = allBooks.slice(i, i + booksPerPage);
        result.push(chunk);
    }
    return result;
}