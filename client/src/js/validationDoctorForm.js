function validateForm() {
    const nameInput = document.getElementById('Name');
    const middleName = document.getElementById("MiddleName");
    const surname = document.getElementById("Surname");
    const dateOfBirth = document.getElementById("DateOfBirth");
    const address = document.getElementById("Address");
    const position = document.getElementById("Position");
    const dateOfAcceptance = document.getElementById("DateOfAcceptance");
    const email = document.getElementById('Email');

    const errorName = document.getElementById("errorName");
    const errorMiddleName = document.getElementById("errorMiddleName");
    const errorSurname = document.getElementById("errorSurname");
    const errorDateOfBirth = document.getElementById("errorDateOfBirth");
    const errorAddress = document.getElementById("errorAddress");
    const errorPosition = document.getElementById("errorPosition");
    const errorDateOfAcceptance = document.getElementById("errorDateOfAcceptance");
    const errorSummury = document.getElementById("errorSummury");
    const emailErr = document.getElementById('errorEmail')

    resetErrors(
        [nameInput, middleName, surname, dateOfBirth, address, position, dateOfAcceptance, email],
        [errorName, errorMiddleName, errorSurname, errorDateOfBirth, errorAddress, errorPosition, errorDateOfAcceptance, emailErr],
        errorSummury
    );

    let valid = true;


    if (!checkRequired(email.value)) {
        valid = false;
        email.classList.add('error-input');
        emailErr.innerText = 'Required!';
    } else if (!checkEmail(email.value)) {
        valid = false;
        email.classList.add('error-input');
        emailErr.innerText = "Type valid email!"
    }


    if (!checkTextLengthRange(middleName.value, 0, 50)) {
        valid = false;
        middleName.classList.add('error-input');
        errorMiddleName.innerText = "Max length is 50 tokens!"
    }

    if (!checkRequired(position.value)) {
        valid = false;
        position.classList.add("error-input");
        errorPosition.innerText = "Required";
    } else if (!checkTextLengthRange(position.value, 2, 50)) {
        valid = false;
        position.classList.add("error-input");
        errorPosition.innerText = "Should be from 2 to 50 tokens!"
    }

    if (!checkRequired(address.value)) {
        valid = false;
        address.classList.add("error-input");
        errorAddress.innerText = "Required!";
    } else if (!checkTextLengthRange(address.value, 2, 50)) {
        valid = false;
        address.classList.add("error-input");
        errorAddress.innerText = "Should be from 2 to 50 tokens!"
    }

    let nowDate = new Date(), month = '' + (nowDate.getMonth() + 1), day = '' + nowDate.getDate(), year = nowDate.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    const now = [year, month, day].join('-');

    if (!checkRequired(dateOfAcceptance.value)) {
        valid = false;
        dateOfAcceptance.classList.add("error-input");
        errorDateOfAcceptance.innerText = "Required!";
    } else if (!checkDate(dateOfAcceptance.value)) {
        valid = false;
        dateOfAcceptance.classList.add("error-input");
        errorDateOfAcceptance.innerText = "Should be a date!";
    } else if (checkDateIfAfter(dateOfAcceptance.value, now)) {
        valid = false;
        dateOfAcceptance.classList.add("error-input");
        errorDateOfAcceptance.innerText = "Date cannot be in the future!";
    }

    if (!checkRequired(dateOfBirth.value)) {
        valid = false;
        dateOfBirth.classList.add("error-input");
        errorDateOfBirth.innerText = "Required!";
    } else if (!checkDate(dateOfBirth.value)) {
        valid = false;
        dateOfBirth.classList.add("error-input");
        errorDateOfBirth.innerText = "Should be a date!";
    } else if (checkDateIfAfter(dateOfBirth.value, now)) {
        valid = false;
        dateOfBirth.classList.add("error-input");
        errorDateOfBirth.innerText = "Date cannot be in the future!";
    }

    if (!checkRequired(surname.value)) {
        valid = false;
        surname.classList.add("error-input");
        errorSurname.innerText = "Required!"
    } else if (!checkTextLengthRange(surname.value, 2, 50)) {
        valid = false;
        surname.classList.add("error-input");
        errorSurname.innerText = "Should be from 2 to 50 tokens!";
    }

    if (!checkRequired(nameInput.value)) {
        valid = false;
        nameInput.classList.add("error-input");
        errorName.innerText = "Required!"
    } else if (!checkTextLengthRange(nameInput.value, 2, 50)) {
        valid = false;
        nameInput.classList.add("error-input");
        errorName.innerText = "Should be from 2 to 50 tokens!";
    }

    if (!valid)
        errorSummury.innerText = "Form have errors!";

    return valid;
}