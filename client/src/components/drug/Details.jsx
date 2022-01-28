import React, { useState, useEffect } from "react";
import { NavLink as Link, useParams } from "react-router-dom"
import EmptyList from "../fragments/EmptyList";
import moment from "moment";
import { useTranslation } from "react-i18next";

function DoctorDetailsData(props) {
    const doc = props.data;
    const t = props.t;
    return (
        <React.Fragment>
            <form className="form">
                <input type="hidden" name="id" defaultValue={doc.id} />

                <div className="grid">
                    <label htmlFor="name">{t('title')}</label>
                    <input type="text" name="name" id="Email" defaultValue={doc.name} disabled />
                    <span id="errorName"></span>
                </div>

                <div className="grid">
                    <label htmlFor="description">{t('description')}</label>
                    <input type="text" name="desciption" id="Name" defaultValue={doc.description} disabled />
                    <span id="errorName"></span>
                </div>

                <div className="form-buttons">
                    {localStorage.getItem('user') !== 'user' ? <Link to={"/drugs/edit/" + doc.id} className="list-actions-button-edit">{t('edit')}</Link> : ""}
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
                            <th className="hide" scope="col">{t('note')}</th>
                            <th scope="col">{t('note')}</th>
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
        fetch("http://localhost:3000/api/drugs/" + id, {headers: {authorization: `Bearer ${localStorage.getItem('token')}`}})
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
        content = <DoctorDetailsData data={doc} t={t}/>;
    }

    return (
        <main>
            <h2>{t('details')}</h2>
            {content}
            <div className="form-buttons">
                <Link to="/drugs" className="list-actions-button-details">{t('back')}</Link>
            </div>
        </main>
    );
}