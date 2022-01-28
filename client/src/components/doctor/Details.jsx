import React, { useState, useEffect } from "react";
import { NavLink as Link, useLocation, useNavigate, useParams } from "react-router-dom"
import EmptyList from "../fragments/EmptyList";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { checkRequired, checkTextLengthRange } from "../../js/validationCommon";

function DoctorDetailsData(props) {
    const t = props.t;
    const doc = props.data;
    return (
        <React.Fragment>
            <form className="form">
                <input type="hidden" name="id" defaultValue={doc.id} />

                <div className="grid">
                    <label htmlFor="email">{t('email')}</label>
                    <input type="text" name="email" id="Email" defaultValue={doc.person.email} disabled />
                    <span id="errorName"></span>
                </div>

                <div className="grid">
                    <label htmlFor="name">{t('name')}</label>
                    <input type="text" name="name" id="Name" defaultValue={doc.person.name} disabled />
                    <span id="errorName"></span>
                </div>

                <div className="grid">
                    <label htmlFor="middleName">{t('middleName')}</label>
                    <input type="text" name="middleName" id="MiddleName" defaultValue={doc.person.middleName} disabled />
                    <span id="errorMiddleName"></span>
                </div>

                <div className="grid">
                    <label htmlFor="surname">{t('surname')}</label>
                    <input type="text" name="surname" id="Surname" defaultValue={doc.person.surname} disabled />
                    <span id="errorSurname"></span>
                </div>

                <div className="grid">
                    <label htmlFor="dateOfBirth">{t('dateOfBirth')}</label>
                    <input type="date" name="dateOfBirth" id="DateOfBirth" defaultValue={moment(Date(doc.person.dateOfBirth)).format('YYYY-MM-DD')} disabled />
                    <span id="errorDateOfBirth"></span>
                </div>

                <div className="grid">
                    <label htmlFor="address">{t('address')}</label>
                    <input type="text" name="address" id="Address" defaultValue={doc.person.address} disabled />
                    <span id="errorAddress"></span>
                </div>
                <div className="grid">
                    <label htmlFor="position">{t('position')}</label>
                    <input type="text" name="position" id="Position" defaultValue={doc.position} disabled />
                    <span id="errorPosition"></span>
                </div>
                <div className="grid">
                    <label htmlFor="dateOfAcceptance">{t('dateOfAcceptance')}</label>
                    <input type="date" name="dateOfAcceptance" id="DateOfAcceptance" defaultValue={moment(Date(doc.dateOfAcceptance)).format('YYYY-MM-DD')} disabled />
                    <span id="errorDateOfAcceptance"></span>
                </div>

                <div className="form-buttons">
                    {localStorage.getItem('user') !== 'user' ? <Link to={"/doctors/edit/" + doc.id} className="list-actions-button-edit">{t('edit')}</Link> : ""}
                </div>
            </form>

            <h2>{t('prescriptions')}</h2>
            {doc.prescriptions.length !== 0 ?
                (<table className="table-list">
                    <caption></caption>
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">{t('dateOfPrescription')}</th>
                            <th scope="col">{t('note')}</th>
                            <th scope="col">{t('dosage')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(doc.prescriptions.map(presc => (
                            <tr key={presc.id}>
                                <td><Link to={"/prescriptions/details/" + presc.id}>{presc.id}</Link></td>
                                <td>{moment(presc.dateOfPrescription).format('YYYY-MM-DD')}</td>
                                <td>{presc.note}</td>
                                <td>{presc.dosage}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>) : (<EmptyList />)}
        </React.Fragment>
    );
}


export default function DoctorDetails() {
    const { t } = useTranslation();
    let params = useParams();
    let [id, setId] = useState(parseInt(params.id));
    let [doc, setDoc] = useState(null);
    let [error, setError] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);
    let [message, setMessage] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/doctors/" + id, { headers: { authorization: 'Bearer ' + localStorage.getItem('token') } })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    setDoc(null);
                    setMessage(data.message);
                } else {
                    setDoc(data);
                    setMessage(null);
                }
                setIsLoaded(true);
            }, err => {
                setIsLoaded(true);
                setError(err);
            });
    }, []);

    let content;

    if (error) {
        content = <p>{t('error') + " " + error.message}</p>;
    } else if (!isLoaded) {
        content = <p>{t('loading')}</p>;
    } else if (message) {
        content = <p>{message}</p>;
    } else {
        content =
            <div>
                <DoctorDetailsData data={doc} t={t} />
                <Opinions doctor={doc} t={t}/>
            </div>
    }

    return (
        <main>
            <h2>{t('details')}</h2>
            {content}
            <div className="form-buttons">
                <Link to="/doctors" className="list-actions-button-details mini">{t('back')}</Link>
            </div>
        </main>
    );
}

function Opinions(props) {
    const json = JSON.parse(localStorage.getItem('json'));
    const t = props.t;
    const [user, setUser] = useState(json);
    const [doctor, setDoctor] = useState(props.doctor);
    const [opinion, setOpinion] = useState(localStorage.getItem('user') === "admin" || localStorage.getItem('user') === 'doctor' ? {} : { text: "", doctor_id: doctor.id, patient_id: user.patient.id });
    const [errors, setErrors] = useState({ text: "" });


    const updateOpinion = async (id, data) => {
        const string = JSON.stringify(data);
        const options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: string
        }
        return fetch(`http://localhost:3000/api/opinions/${id}`, options);
    }

    const addOpinion = async (data) => {
        const string = JSON.stringify(data);
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: string
        }
        return fetch(`http://localhost:3000/api/opinions`, options);
    }

    const deleteOpinion = async (id) => {
        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
        await fetch(`http://localhost:3000/api/opinions/${id}`, options).then(() => {
            navigate('/doctors', { state: { notice: t('deleted')} });
        });
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const op = { ...opinion };
        op[name] = value;

        const errMsg = validateField(name, value);
        const errs = { ...errors };
        errs[name] = errMsg;

        setOpinion(op);
        setErrors(errs);
    }

    const validateField = (n, v) => {
        let errMsg = "";
        if (n === 'text') {
            if (!checkRequired(v)) {
                errMsg = 'r';
            } else if (!checkTextLengthRange(v, 25, 255)) {
                errMsg = 'r_25_255'
            }
        }

        return t(errMsg);
    }

    const validateForm = () => {
        const errs = { ...errors };
        for (const name in opinion) {
            const value = opinion[name];
            const errMsg = validateField(name, value);
            errs[name] = errMsg;
        }

        return !hasErrors();
    }

    const hasErrors = () => {
        const errs = { ...errors };
        for (const field in errs) {
            if (errs[field] > 0) {
                return true;
            }
        }
        return false;
    }
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            let promise, response;
            promise = addOpinion(opinion);
            if (promise) {
                await promise.then(data => {
                    response = data;
                    return data.json();
                }).then(data => {
                    if (response) {
                        console.log(data);
                        navigate('/doctors', { state: { notice: t('added') } });
                    }
                });
            }
        }
    }




    return (
        <div className="opinions-container">
            <h2>{t('opinions')}</h2>
            <div className="opinions">
                {doctor.opinions.map(op =>
                    <div className="opinion">
                        <span className="opinion-name">{localStorage.getItem('user') === 'user' || localStorage.getItem('user') === 'admin' ? op.patient.person.email : t('anon')}</span>
                        <span>{op.text}</span>
                        {(user.patient && user.patient.id === op.patient.id) || localStorage.getItem('user') === 'admin' ?
                            <span className="buttons">
                                <button className="btn-del" onClick={() => { deleteOpinion(op.id) }}>{t('delete')}</button>
                            </span> : " "}
                    </div>
                )}
                {doctor.opinions.length === 0 ? <EmptyList></EmptyList> : ""}
            </div>
            <form className="add-my-opinion" onSubmit={handleSubmit}>
                <input type="hidden" name="doctor_id" defaultValue={opinion.doctor_id} />
                <input type="hidden" name="patient_id" defaultValue={opinion.patient_id} />

                {localStorage.getItem('user') === 'admin' || localStorage.getItem('user') === 'doctor' ? "" :
                    <div>
                        <h2>{t('add-opinion')}</h2>
                        <textarea type="text" name="text" className="str" defaultValue={opinion.text} onChange={handleChange} />
                        <span className="errors-text">{errors.text}</span>
                    </div>}
                {localStorage.getItem('user') === 'admin' || localStorage.getItem('user') === 'doctor' ? "" :
                    <div className="form-buttons">
                        <input type="submit" value={t('add')} className="list-actions-button-edit mino" />
                    </div>}
            </form>
        </div>
    );
}