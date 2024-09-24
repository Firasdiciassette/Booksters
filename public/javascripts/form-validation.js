"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const email = document.getElementById('email');
    const confirmPassword = document.getElementById('confirm-password');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validateLogin()) {
                loginForm.submit();
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validateRegistration()) {
                registerForm.submit();
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

    const validateLogin = () => {
        const usernameValue = username.value.trim();
        const passValue = password.value.trim();
        let isValid = true;

        if (usernameValue === '') {
            setError(username, "Username is required.");
            isValid = false;
        } else if (!isValidUsername(usernameValue)) {
            setError(username, "Enter a valid username.");
            isValid = false;
        } else {
            setSuccess(username);
        }

        if (passValue === '') {
            setError(password, 'Password is required.');
            isValid = false;
        } else if (passValue.length < 8) {
            setError(password, 'Password must be at least 8 characters.');
            isValid = false;
        } else {
            setSuccess(password);
        }

        return isValid;
    }

    const validateRegistration = () => {
        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();
        const passValue = password.value.trim();
        const confirmPassValue = confirmPassword.value.trim();
        let isValid = true;

        if (usernameValue === '') {
            setError(username, "Username is required.");
            isValid = false;
        } else if (!isValidUsername(usernameValue)) {
            setError(username, "Enter a valid username.");
            isValid = false;
        } else {
            setSuccess(username);
        }

        if (emailValue === '') {
            setError(email, "Email is required.");
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(email, "Enter a valid email.");
            isValid = false;
        } else {
            setSuccess(email);
        }

        if (passValue === '') {
            setError(password, 'Password is required.');
            isValid = false;
        } else if (passValue.length < 8) {
            setError(password, 'Password must be at least 8 characters.');
            isValid = false;
        } else {
            setSuccess(password);
        }

        if (confirmPassValue === '') {
            setError(confirmPassword, 'Please confirm your password.');
            isValid = false;
        } else if (confirmPassValue !== passValue) {
            setError(confirmPassword, 'Passwords do not match.');
            isValid = false;
        } else {
            setSuccess(confirmPassword);
        }

        return isValid;
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
