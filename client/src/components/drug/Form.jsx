import React, { useState, useEffect } from "react";
import { NavLink as Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { checkRequired, checkTextLengthRange } from "../../js/validationCommon";
import { useTranslation } from "react-i18next";



export default function AddForm() {
    let params = useParams();
    const { t } = useTranslation();
    const formMode = {
        NEW: t('add'),
        EDIT: t('edit')
    }
    let [id, setId] = useState(parseInt(params.id));
    let [doc, setDoc] = useState({
        name: '',
        description: ''
    });
    let [errors, setErrors] = useState({
        name: '',
        description: ''
    });
    let [mode, setMode] = useState(params.id ? formMode.EDIT : formMode.NEW);
    let [redirect, setRedirect] = useState(false);
    let [error, setError] = useState(null);
    let [message, setMessage] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();


    useEffect(async () => {
        if (mode === formMode.EDIT && !isLoaded) {
            await fetch("http://localhost:3000/api/drugs/" + id, { headers: { authorization: `Bearer ${localStorage.getItem('token')}`}})
                .then(res => res.json())
                .then(data => {
                    if (data.message) {
                        setMessage(data.message);
                        setError(null);
                    } else {
                        setDoc({ ...data });
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
        const errs = { ...errors };
        errs[name] = errorMessage;

        setDoc(doctor);
        setErrors(errs);
    }

    let validateField = (n, v) => {
        let errorMes = "";

        if (n === 'name' || n === 'description') {
            if (!checkRequired(v)) {
                errorMes = t("r");
            } else if (!checkTextLengthRange(v, 2, 50)) {
                errorMes = t("r_2_50")
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
        const doctor = { ...doc, ...doc.person };
        const errs = errors;
        for (const name in doctor) {
            const value = doctor[name];
            const errMes = validateField(name, value);
            errs[name] = errMes;
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
                                let errMesg = array.errors[i].message;
                                errMesg = t(errMesg);
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
        return fetch("http://localhost:3000/api/drugs", options);
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

        return fetch(`http://localhost:3000/api/drugs/${iD}`, options);
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
        navigate('/drugs', { state: { notice: notice } });
    }



    return (
        <main>
            <h2>{title}</h2>
            {content === true ? (<form method="post" className="form" onSubmit={handleSubmit}>
                <input type="hidden" name="id" />

                <div className="grid">
                    <label htmlFor="name">{t('title')}</label>
                    <input type="text" name="name" id="Email" defaultValue={doc.name} onChange={handleChange} />
                    <span id="errorName" className="errors-text">{errors.name}</span>
                </div>

                <div className="grid">
                    <label htmlFor="description">{t('description')}</label>
                    <input type="text" name="description" id="Name" defaultValue={doc.description} onChange={handleChange} />
                    <span id="errorName" className="errors-text">{errors.description}</span>
                </div>
                <span id="errorSummury" className="errors-text">{sum}</span>

                <div className="grid-buttons">
                    <div className="form-buttons">
                        <input type="submit" value={mode} className={clas} onClick={handleChange} onMouseMove={handleChange} />
                        <Link to="/drugs" className="form-button-cancel">{t('cancel')}</Link>
                    </div>
                </div>
            </form>) : (content)}

        </main>
    );
}