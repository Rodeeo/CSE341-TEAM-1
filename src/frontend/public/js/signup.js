signupHandler = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const url = '/signup';
    const formData = new FormData(form);

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
            name: formData.get('name'),
            lastName: formData.get('lastName'),
            organizationRole: formData.get('organizationRole'),
            organizationId: formData.get('organizationId'),
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
        })
        .catch(err => {
            console.log(err);
        });
};
const signupForm = document.getElementById('signup-Form');
signupForm.addEventListener('submit', signupHandler);