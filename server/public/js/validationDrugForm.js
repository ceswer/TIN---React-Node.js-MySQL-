function validateForm() {
    const nameInp = document.getElementById("Name");
    const desc = document.getElementById("Description");

    const errName = document.getElementById('errorName');
    const errDesc = document.getElementById('errorDescription');

    const errSum = document.getElementById('errSum');

    resetErrors(
        [nameInp, desc],
        [errName, errDesc],
        errSum
    );

    let valid = true;

    if (!checkRequired(nameInp.value)) {
        valid = false;
        nameInp.classList.add('error-input');
        errName.innerText = "Required!";
    } else if (!checkTextLengthRange(nameInp.value, 2, 50)) {
        valid = false;
        nameInp.classList.add('error-input');
        errName.innerText = "Should be from 2 to 50 tokens!";
    }

    if (!checkRequired(desc.value)) {
        valid = false;
        desc.classList.add('error-input');
        errDesc.innerText = "Required!";
    } else if (!checkTextLengthRange(desc.value, 10, 500)) {
        valid = false;
        desc.classList.add('error-input');
        errDesc.innerText = "Should be from 10 to 500!"
    }

    if (!valid)
        errSum.innerText = "Form has errors!"

    return valid;
}