angular.module('myApp').factory('booksService', ['$rootScope', function ($rootScope) {
    const service = {
        allBooks: getDefaultBooks(35),
        getAllBooks: function () {
            return this.allBooks;
        },
        selectedBook: undefined,
        getSelectedBook: function () {
            return this.selectedBook;
        },
        setSelectedBook: function (newBook) {
            this.selectedBook = newBook;
            $rootScope.$broadcast('selectedBook:updated', newBook);
        },
        bookToEdit: undefined,
        getBookToEdit: function () {
            return this.bookToEdit;
        },
        setBookToEdit: function (id) {
            const newBook = {...this.allBooks.find(b => b.id === id)}
            this.bookToEdit = newBook;
            $rootScope.$broadcast('bookToEdit:updated', newBook);
        },
        editBook: function (editedBook) {
            const updatedAllBooks = [...this.allBooks].map(b => {
                if (b.id === editedBook.id) {
                    return editedBook;
                }
                return b;
            });
            this.allBooks = updatedAllBooks;
            this.selectedBook = editedBook;
            $rootScope.$broadcast('selectedBook:updated', editedBook);
            $rootScope.$broadcast('allBooks:updated', updatedAllBooks);
        },
        deleteBook: function (id) {
            const updatedAllBooks = this.allBooks.filter(b => {
                return b.id !== id
            });
            this.allBooks = updatedAllBooks;
            $rootScope.$broadcast('allBooks:updated', updatedAllBooks);
        }
    }
    $rootScope.$on("getAllBooks", service.getAllBooks);
    $rootScope.$on("getSelectedBook", service.getSelectedBook);
    $rootScope.$on("setSelectedBook", service.setSelectedBook);
    $rootScope.$on("getBookToEdit", service.getBookToEdit);
    $rootScope.$on("setBookToEdit", service.setBookToEdit);
    $rootScope.$on("editBook", service.editBook);
    $rootScope.$on("deleteBook", service.deleteBook);
    return service;
}])