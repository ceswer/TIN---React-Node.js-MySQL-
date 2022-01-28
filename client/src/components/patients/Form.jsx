import React, { useState, useEffect } from "react";
import { NavLink as Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { checkDate, checkEmail, checkRequired, checkTextLengthRange } from "../../js/validationCommon";
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
    let [doc, setDoc] = useState({
        name: '',
        surname: '',
        middleName: '',
        email: '',
        dateOfBirth: null,
        address: '',
        phoneNumber: '',
        dateOfRegistration: null
    });
    let [errors, setErrors] = useState({
        name: '',
        surname: '',
        middleName: '',
        email: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        dateOfRegistration: ''
    });
    let [mode, setMode] = useState(params.id ? formMode.EDIT : formMode.NEW);
    let [redirect, setRedirect] = useState(false);
    let [error, setError] = useState(null);
    let [message, setMessage] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();


    useEffect(async () => {
        if (mode === formMode.EDIT && !isLoaded) {
            let json = localStorage.getItem('json');
            json = JSON.parse(json);
            if (localStorage.getItem('user') === 'user' && json.patient.id != id) {
                await fetch("http://localhost:3000/api/patients/" + json.patient.id, { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } })
                    .then(res => res.json())
                    .then(data => {
                        if (data.message) {
                            setMessage(data.message);
                            setError(null);
                        } else {
                            setDoc({ ...data, ...data.person });
                            setMessage(null);
                            setError(null);
                        }
                        setIsLoaded(true);

                    }, err => {
                        setIsLoaded(true);
                        setError(err);
                    });
            } else 
                await fetch("http://localhost:3000/api/patients/" + id, { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } })
                    .then(res => res.json())
                    .then(data => {
                        if (data.message) {
                            setMessage(data.message);
                            setError(null);
                        } else {
                            setDoc({ ...data, ...data.person });
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
        const doctor = { ...doc };
        doctor[name] = value;

        const errorMessage = validateField(name, value);
        console.log(name, value);
        const errs = { ...errors };
        errs[name] = t(errorMessage);

        setDoc(doctor);
        setErrors(errs);
    }

    let validateField = (n, v) => {
        let errorMes = "";
        if (n === 'email') {
            if (!checkRequired(v)) {
                errorMes = 'r';
            } else if (!checkEmail(v)) {
                errorMes = "ne"
            }
        }

        if (n === 'middleName') {
            if (!checkTextLengthRange(v, 0, 50)) {
                errorMes = "r_2_50"
            }
        }

        if (n === 'phoneNumber' || n === 'address' || n === 'surname' || n === 'name') {
            if (!checkRequired(v)) {
                errorMes = "r";
            } else if (!checkTextLengthRange(v, 2, 50)) {
                errorMes = "r_2_50"
            }
        }

        if (n === 'dateOfRegistration' || n === 'dateOfBirth') {
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
        const doctor = { ...doc };
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
            const doctor = doc, formmode = mode;
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
                            for (let i in array.errors) {
                                const errMesg = array.errors[i].message;
                                const fieldNam = array.errors[i].path;
                                ers[fieldNam] = t(errMesg);
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
        return fetch("http://localhost:3000/api/patients", options);
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

        return fetch(`http://localhost:3000/api/patients/${iD}`, options);
    }

    sum = hasErrors() ? t('errors') : '';
    const title = mode === formMode.NEW ? t('add') : t('edit');

    let clas = "form-button-submit";
    if (sum) {
        clas = 'grey'
    }

    let content;

    if (error) {
        content = <p>{t('error') + " " + error.message}</p>
    } else if (!isLoaded && mode === formMode.EDIT) {
        content = <p>{t('loading')}</p>
    } else if (message) {
        content = <p>{message}</p>
    } else {
        content = true;
    }


    if (redirect) {
        const currentFormMode = mode;
        const notice = currentFormMode === formMode.NEW ? t('added') : t('edited');
        navigate('/patients', { state: { notice: notice } });
    }



    return (
        <main>
            <h2>{title}</h2>
            {content === true ? (<form method="post" className="form" onSubmit={handleSubmit}>
                <input type="hidden" name="id" />

                <div className="grid">
                    <label htmlFor="email">{t('email')}</label>
                    <input type="text" name="email" id='Email' defaultValue={doc.email} onChange={(e) => handleChange(e)} />
                    <span id="errorEmail" className="errors-text">{errors.email}</span>
                </div>

                <div className="grid">
                    <label htmlFor="name">{t('name')}</label>
                    <input type="text" name="name" id="Name" defaultValue={doc.name} onChange={(e) => handleChange(e)} />
                    <span id="errorName" className="errors-text">{errors.name}</span>
                </div>

                <div className="grid">
                    <label htmlFor="middleName">{t('middleName')}</label>
                    <input type="text" name="middleName" id="MiddleName" defaultValue={doc.middleName} onChange={handleChange} />
                    <span id="errorMiddleName" className="errors-text">{errors.middleName}</span>
                </div>

                <div className="grid">
                    <label htmlFor="surname">{t('surname')}</label>
                    <input type="text" name="surname" id="Surname" defaultValue={doc.surname} onChange={handleChange} />
                    <span id="errorSurname" className="errors-text">{errors.surname}</span>
                </div>

                <div className="grid">
                    <label htmlFor="dateOfBirth">{t('dateOfBirth')}</label>
                    <input type="date" name="dateOfBirth" id="DateOfBirth" defaultValue={moment(doc.dateOfBirth).format('YYYY-MM-DD')} onChange={handleChange} />
                    <span id="errorDateOfBirth" className="errors-text">{errors.dateOfBirth}</span>
                </div>

                <div className="grid">
                    <label htmlFor="address">{t('address')}</label>
                    <input type="text" name="address" id="Address" defaultValue={doc.address} onChange={handleChange} />
                    <span id="errorAddress" className="errors-text">{errors.address}</span>
                </div>
                <div className="grid">
                    <label htmlFor="position">{t('phoneNumber')}</label>
                    <input type="text" name="phoneNumber" id="Position" defaultValue={doc.phoneNumber} onChange={handleChange} />
                    <span id="errorPosition" className="errors-text">{errors.phoneNumber}</span>
                </div>
                <div className="grid">
                    <label htmlFor="dateOfRegistration">{t('dateOfRegistration')}</label>
                    <input type="date" name="dateOfRegistration" id="DateOfAcceptance" defaultValue={moment(doc.dateOfRegistration).format('YYYY-MM-DD')} onChange={handleChange} />
                    <span id="errorDateOfAcceptance" className="errors-text">{errors.dateOfRegistration}</span>
                </div>
                <span id="errorSummury" className="errors-text">{sum}</span>

                <div className="grid-buttons">
                    <div className="form-buttons">
                        <input type="submit" name="submit" value={mode} className={clas} onClick={handleChange} onMouseMove={handleChange} />
                        <Link to="/patients" className="form-button-cancel">{t('cancel')}</Link>
                    </div>
                </div>
            </form>) : (content)}

        </main>
    );
}