const submitButton = document.getElementById('submit-button');
const audioFileInput = document.getElementById('uploadFile');

submitButton.addEventListener('click', () => {
    const file = audioFileInput.files[0];
    console.log(file);
    if (!file) {
        alert('Please select a file');
        return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    axios.post('http://localhost:3000/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
});
