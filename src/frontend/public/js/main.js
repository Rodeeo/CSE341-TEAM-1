
const loginHandler = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    const formData = new FormData(form);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: formData.email,
            password: formData.password
        })
    })
        .then(res => {
            if (res.status === 422) {
                throw new Error('Validation failed.');
            }
            if (res.status !== 200 && res.status !== 201) {
                console.log('Error!');
                throw new Error('Could not authenticate you!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            localStorage.setItem('token', resData.token);
            localStorage.setItem('userId', resData.userId);
            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date(
                new Date().getTime() + remainingMilliseconds
            );
            localStorage.setItem('expiryDate', expiryDate.toISOString());
            this.setAutoLogout(remainingMilliseconds);
        })
        .catch(err => {
            console.log(err);
        });
};

signupHandler = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    const formData = new FormData(form);
    const plainFormData = Object.fromEntries(formData.entries());

    console.log(plainFormData.password)
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            lastName: formData.lastName
        })
    })
        .then(res => {
            if (res.status === 422) {
                throw new Error(
                    "Validation failed. Make sure the email address isn't used yet!"
                );
            }
            if (res.status !== 200 && res.status !== 201) {
                console.log('Error!');
                throw new Error('Creating a user failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            this.props.history.replace('/');
        })
        .catch(err => {
            console.log(err);
        });
};

logoutHandler = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
};

setAutoLogout = milliseconds => {
    setTimeout(() => {
        logoutHandler();
    }, milliseconds);
};
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signup-Form');

// loginForm.addEventListener('submit', loginHandler);
signupForm.addEventListener('submit', signupHandler);