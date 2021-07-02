const loginHandler = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const url = "/login";
    const formData = new FormData(form);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
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
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', loginHandler);