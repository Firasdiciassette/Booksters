"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const bookTitle = document.getElementById('book-title');
    const bookAuthor = document.getElementById('book-author');
    const bookGenre = document.getElementById('book-genre');
    const bookCover = document.getElementById('book-cover');
    const bookDescription = document.getElementById('book-description');

    if (bookForm) {
        bookForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validateBookForm()) {
                bookForm.submit();
            }
        });
    }   
    const setError = (element, message) => {
        const inputControl = element.parentElement; 
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    };

    const setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateBookForm = () => {
        debugger
        let isValid = true;

        if (bookTitle.value.trim() === '') {
            setError(bookTitle, 'Title is required.');
            isValid = false;
        } else {
            console.log("Title is Ok.");
            setSuccess(bookTitle);
        }

        if (bookAuthor.value.trim() === '') {
            setError(bookAuthor, 'Author is required.');
            isValid = false;
        } else {
            setSuccess(bookAuthor);
        }

        if (bookCover.value.trim() !== '' && !isValidUrl(bookCover.value.trim())) {
            setError(bookCover, 'the url of the cover must be a valid URL.');
            isValid = false;
        } else {
            setSuccess(bookCover);
        }
        setSuccess(bookGenre);
        setSuccess(bookDescription);

        console.log('Book form validation results: ', isValid);

        return isValid;
    };
});
