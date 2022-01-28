function validateForm() {
    const drug = document.getElementById('Drug');
    const doctor = document.getElementById('Doctor');
    const patient = document.getElementById('Patient');
    const dateOfPresc = document.getElementById('DateOfPrescription');
    const note = document.getElementById("Note");
    const dosage = document.getElementById("Dosage");

    const drugErr = document.getElementById('DrugError');
    const doctorErr = document.getElementById('DoctorError');
    const patientErr = document.getElementById('PatientError');
    const dateOfPrescErr = document.getElementById('errorDateOfPrescription');
    const noteErr = document.getElementById("errorNote");
    const dosageErr = document.getElementById("errorDosage");

    const errSum = document.getElementById("errSum");

    let e = 'error-input';
    let valid = true;

    resetErrors(
        [drug, doctor, patient, dateOfPresc, note, dosage],
        [drugErr, doctorErr, patientErr, dateOfPrescErr, noteErr, dosageErr],
        errSum
    )

    if (!checkRequired(drug.value)) {
        drug.classList.add(e);
        valid = false;
        drugErr.innerText = "Required!";
    }

    if (!checkRequired(doctor.value)) {
        doctor.classList.add(e);
        valid = false;
        doctorErr.innerText = "Required!";
    }

    if (!checkRequired(patient.value)) {
        patient.classList.add(e);
        valid = false;
        patientErr.innerText = "Required!";
    }

    if (!checkRequired(note.value)) {
        valid = false;
        note.classList.add(e);
        noteErr.innerText = "Required!";
    } else if (!checkTextLengthRange(note.value, 10, 50)) {
        valid = false;
        note.classList.add(e);
        noteErr.innerText = "Should be from 10 to 50 tokents!";
    }

    if (!checkRequired(dosage.value)) {
        dosage.classList.add(e);
        valid = false;
        dosageErr.innerText = "Required!";
    } else if (!checkNumber(dosage.value)) {
        valid = false;
        dosage.classList.add(e);
        dosageErr.innerText = "Not a number!";
    }

    let nowDate = new Date(), month = '' + (nowDate.getMonth() + 1), day = '' + nowDate.getDate(), year = nowDate.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    const now = [year, month, day].join('-');

    if (!checkRequired(dateOfPresc.value)) {
        valid = false;
        dateOfPresc.classList.add("error-input");
        dateOfPrescErr.innerText = "Required!";
    } else if (!checkDate(dateOfPresc.value)) {
        valid = false;
        dateOfPresc.classList.add("error-input");
        dateOfPrescErr.innerText = "Should be a date!";
    } else if (checkDateIfAfter(dateOfPresc.value, now)) {
        valid = false;
        dateOfPresc.classList.add("error-input");
        dateOfPrescErr.innerText = "Date cannot be in the future!";
    }

    if (!valid)
        errSum.innerText = "Form contains errors!"

    return valid;
}