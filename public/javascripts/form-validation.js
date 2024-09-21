"use strict";
/* Note that unless you use a framework that takes care of this for you, 
you’ll also need to wrap that in the DOMContentLoaded event callback, 
so your event handler is attached to the DOM element after the DOM has been loaded 
(otherwise it might be attached before, end it ends up failing to work): */
document.addEventListener('DOMContentLoaded', () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const form = document.getElementById('login-form');


    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 
            // alert('form submit event!');
            if(validateInput()){
                form.submit();
            }
            
        });
    }

    const setError = (element, message) => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }

    const setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    }

    const validateInput = () => {
        const usernameValue = username.value.trim();
        const passValue = password.value.trim();

        if (usernameValue === '') {
            setError(username, "Username/Email is required.");
        } else if (!isValidEmail(usernameValue) && !isValidUsername(usernameValue)) {
            setError(username, "Enter a valid email or username");
        } else {
            setSuccess(username);
        }

        if (passValue === '') {
            setError(password, 'Password is required.');
        } else if (passValue.length < 8) {
            setError(password, 'Password must be at least 8 characters.');
        } else {
            setSuccess(password);
        }
    }

    const isValidEmail = email => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    const isValidUsername = username => {
        const re = /^[a-zA-Z0-9]+$/;
        return re.test(username);
    }
});
