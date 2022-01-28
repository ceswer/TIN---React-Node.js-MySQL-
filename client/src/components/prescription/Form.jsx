import React, { useState, useEffect } from "react";
import { NavLink as Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { checkDate, checkEmail, checkNumber, checkRequired, checkTextLengthRange } from "../../js/validationCommon";
import { useTranslation } from "react-i18next";
import moment from 'moment';


export default function AddForm() {
    let params = useParams();
    let { t } = useTranslation();
    const formMode = {
        NEW: t('add'),
        EDIT: t('edit')
    }
    let [id, setId] = useState(parseInt(params.id));
    let [presc, setPresc] = useState({
        drug_id: null,
        doctor_id: null,
        patient_id: null,
        dateOfPrescription: '',
        note: '',
        dosage: null
    });
    let [errors, setErrors] = useState({
        drug_id: '',
        doctor_id: '',
        patient_id: '',
        dateOfPrescription: '',
        note: '',
        dosage: ''
    });
    let [mode, setMode] = useState(params.id ? formMode.EDIT : formMode.NEW);
    let [redirect, setRedirect] = useState(false);
    let [error, setError] = useState(null);
    let [message, setMessage] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [drugs, setDrugs] = useState([]);


    useEffect(async () => {
        if (!isLoaded) {
            await fetch("http://localhost:3000/api/doctors", { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json()).then(docs => setDoctors(docs));
            await fetch("http://localhost:3000/api/patients", { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json()).then(docs => setPatients(docs));
            await fetch("http://localhost:3000/api/drugs", { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json()).then(docs => setDrugs(docs));
        }

        if (mode === formMode.EDIT && !isLoaded) {
            await fetch("http://localhost:3000/api/prescriptions/" + id, { headers: { authorization: `Bearer ${localStorage.getItem('token')}`}})
                .then(res => res.json())
                .then(data => {
                    if (data.message) {
                        setMessage(data.message);
                        setError(null);
                    } else {
                        setPresc({ ...data });
                        setMessage(null);
                        setError(null);
                    }
                    setIsLoaded(true);
                }, err => {
                    setIsLoaded(true);
                    setError(err);
                });
        }
    }, []);


    let sum;
    const handleChange = async (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const doctor = { ...presc };
        doctor[name] = value;

        const errorMessage = validateField(name, value);
        const errs = { ...errors };
        errs[name] = t(errorMessage);

        setPresc(doctor);
        setErrors(errs);
    }

    let validateField = (n, v) => {
        let errorMes = "";
        if (n === 'note') {
            if (!checkRequired(v)) {
                errorMes = "r";
            } else if (!checkTextLengthRange(v, 2, 255)) {
                errorMes = "r_2_255"
            }
        }

        if (n === 'dosage') {
            if (!checkRequired(v))
                errorMes = "r";
            else if (!checkNumber(v)) {
                errorMes = "n"
            }
        }

        if (n === 'drug_id' || n === 'doctor_id' || n === 'patient_id') {
            if (!checkNumber(v)) {
                errorMes = "r"
            }
        }

        if (n === 'dateOfPrescription') {
            if (!checkRequired(v)) {
                errorMes = "r"
            } else if (!checkDate(v)) {
                errorMes = "d"
            }
        }

        return errorMes;
    }

    let hasErrors = () => {
        const errs = errors;
        for (const field in errs) {
            if (errs[field].length > 0)
                return true;
        }
        return false;
    }

    let validateForm = () => {
        const doctor = { ...presc };
        const errs = errors;
        for (const name in doctor) {
            const value = doctor[name];
            const errMes = validateField(name, value);
            errs[name] = t(errMes);
        }

        return !hasErrors();

    }

    let handleSubmit = async (e) => {
        let ers = { ...errors };
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            const doctor = presc, formmode = mode;
            let promise, response;

            if (formmode === formMode.NEW) {
                promise = addDoc(doctor);
            } else if (formmode === formMode.EDIT) {
                const ID = id;
                promise = updateDoc(ID, doctor);
            }
            if (promise) {
                await promise.then(data => {
                    response = data;
                    let array;
                    const reader = data.body.getReader();
                    reader.read().then(function proccessText({ done, value }) {
                        let enc = new TextDecoder("utf-8");
                        array = enc.decode(value);
                        array = JSON.parse(array);
                        if (response.status === 500) {
                            console.log(array);
                            for (let i in array.errors) {
                                const errMesg = array.errors[i].message;
                                const fieldNam = array.errors[i].path;
                                ers[fieldNam] = errMesg;
                            }
                        } else setRedirect(true);
                    });
                }, er => {
                    setError(er);
                });
            }
            setErrors(ers);
        }
    }

    let addDoc = (doctor) => {
        const string = JSON.stringify(doctor);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: string
        }
        return fetch("http://localhost:3000/api/prescriptions", options);
    }

    let updateDoc = (iD, doctor) => {
        const string = JSON.stringify(doctor);
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: string
        }

        return fetch(`http://localhost:3000/api/prescriptions/${iD}`, options);
    }

    sum = hasErrors() ? t("errors") : '';
    const title = mode === formMode.NEW ? t('add') : t('edit');

    let clas = "form-button-submit";
    if (sum) {
        clas = 'grey'
    }

    let content;

    if (error) {
        content = <p>{t(error) + " " + error.message}</p>
    } else if (!isLoaded && mode === formMode.EDIT) {
        content = <p>{t('loading')}</p>
    } else if (message) {
        content = <p>{message}</p>
    } else {
        content = true;
    }


    if (redirect) {
        const currentFormMode = mode;
        const notice = currentFormMode === formMode.NEW ? t("added") : t("edited");
        navigate('/prescriptions', { state: { notice: notice } });
    }



    return (
        <main>
            <h2>{title}</h2>
            {content === true ? (<form method="post" className="form" onSubmit={handleSubmit}>
                <input type="hidden" name="id" />

                <div className="grid">
                    <label htmlFor="drug_id">{t('drug')}</label>
                    <select name="drug_id" value={presc.drug_id} defaultValue={'default'} onChange={handleChange}>
                        <option value={'default'}>Choose option</option>
                        {drugs.map(drug => <option value={drug.id} key={drug.id}>{drug.name}</option>)}
                    </select>
                    <span className="errors-text">{errors.drug_id}</span>
                </div>

                <div className="grid">
                    <label htmlFor="doctor_id">{t('doctor')}</label>
                    <select name="doctor_id" value={presc.doctor_id} defaultValue={'default'} onChange={handleChange}>
                        <option value={'default'}>Choose option</option>
                        {doctors.map(doctor => <option value={doctor.id} key={doctor.id}>{doctor.person.name + " " + doctor.person.surname}</option>)}
                    </select>
                    <span className="errors-text">{errors.doctor_id}</span>
                </div>

                <div className="grid">
                    <label htmlFor="patient_id">{t('patient')}</label>
                    <select name="patient_id" value={presc.patient_id} defaultValue={'default'} onChange={handleChange}>
                        <option value={'default'}>Choose option</option>
                        {patients.map(patient => <option value={patient.id} key={patient.id}>{patient.person.name + " " + patient.person.surname}</option>)}
                    </select>
                    <span className="errors-text">{errors.patient_id}</span>
                </div>

                <div className="grid">
                    <label htmlFor="dateOfPrescription">{t('dateOfPrescription')}</label>
                    <input type="date" name="dateOfPrescription" defaultValue={moment(presc.dateOfPrescription).format('YYYY-MM-DD')} onChange={handleChange} />
                    <span className="errors-text">{errors.dateOfPrescription}</span>
                </div>

                <div className="grid">
                    <label htmlFor="note">{t("note")}</label>
                    <input type="text" name="note" defaultValue={presc.note} onChange={handleChange} />
                    <span className="errors-text">{errors.note}</span>
                </div>

                <div className="grid">
                    <label htmlFor="dosage">{t('dosage')}</label>
                    <input type="number" name="dosage" defaultValue={presc.dosage} onChange={handleChange} />
                    <span className="errors-text">{errors.dosage}</span>
                </div>

                <span id="errorSummury" className="errors-text">{sum}</span>

                <div className="grid-buttons">
                    <div className="form-buttons">
                        <input type="submit" value={mode} className={clas} onClick={handleChange} onMouseMove={handleChange} />
                        <Link to="/prescriptions" className="form-button-cancel">{t('cancel')}</Link>
                    </div>
                </div>
            </form>) : (content)}

        </main>
    );
}