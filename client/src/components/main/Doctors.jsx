import React, { useState, useEffect } from "react";
import { NavLink as Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmptyList from "../fragments/EmptyList"

export default function Doctors() {
    const { t } = useTranslation();
    const location = useLocation();

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [notice, setNotice] = useState(location.state && location.state.notice ? location.state.notice : null);
    const [showButton, setShowButton] = useState(false);
    const [ids, setIds] = useState(null);

    const changeToTrue = async () => {
        setShowButton(false);
        await fetch(`http://localhost:3000/api/doctors/${ids}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(() => {
                getDoctors()
                setNotice(t('deleted'))
                setClassName("notice-show");
            });
    }

    const getDoctors = async () => {
        await fetch("http://localhost:3000/api/doctors", { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => res.json())
            .then(docs => {
                setDoctors(docs)
                setIsLoaded(true);
            }, err => {
                setError(err)
                setIsLoaded(true);
            });
    }

    useEffect(() => {
        if (!isLoaded)
            getDoctors();
    }, []);

    const button = <button onClick={changeToTrue} className="list-actions-button-delete">{t('yes')}</button>;
    const deleteDoctor = async (identifier) => {
        setNotice(t('sure'));
        setShowButton(true);
        setIds(identifier);
        setClassName('notice-show');
    }

    let content;
    if (error) {
        content = <p>{t('error') + " " + error}</p>
    } else if (!isLoaded) {
        content = <p>{t('loading')}</p>
    } else content = <DoctorListTable doctors={doctors} t={t} callback={deleteDoctor} />

    let [className, setClassName] = useState(notice ? "notice-show" : "notice-hide");
    const decline = () => {
        setClassName("notice-hide");
    }

    return (
        <main>
            <h2>{t('doctors')}</h2>
            <div className={className}>
                <div className="notice-content">
                    <p>{notice}</p>
                    <div className="btns">
                        {showButton ? button : ""}
                        <button className="list-actions-button-delete green" onClick={decline}>{t('back')}</button>
                    </div>
                </div>
            </div>
            {isLoaded && doctors.length != 0 ? content : <EmptyList></EmptyList>}
            <div className="div-button-add">
                {localStorage.getItem('user') === 'admin' ? <Link to="/doctors/add" className="button-add">{t('add')}</Link> : ""}
            </div>
        </main>
    );
}


function DoctorListTable(props) {
    const t = props.t;
    const doctors = props.doctors;
    const deleteDoctor = props.callback;
    return (
        <table className="table-list">
            <caption></caption>
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">{t('name')}</th>
                    <th scope="col">{t('surname')}</th>
                    <th scope="col" className="hide">{t('position')}</th>
                    <th scope="col">{t('actions')}</th>
                </tr>
            </thead>
            <tbody>
                {doctors.map(doc => <DoctorListTableRow doc={doc} t={t} callback={deleteDoctor} key={doc.id} />)}
            </tbody>
        </table>
    );
}


function DoctorListTableRow(props) {
    const doc = props.doc;
    const t = props.t;
    const deleteDoctor = props.callback;

    return (
        <tr key={doc.id}>
            <td>{doc.id}</td>
            <td>{doc.person.name}</td>
            <td>{doc.person.surname}</td>
            <td className="hide">{doc.position}</td>
            <td>
                <ul className="list-actions">
                    <li><Link to={"/doctors/details/" + doc.id} className="list-actions-button-details">{t('about')}</Link></li>
                    {console.log(localStorage)}
                    {localStorage.getItem('user') === 'admin' ? <li><Link to={"/doctors/edit/" + doc.id} className="list-actions-button-edit">{t('edit')}</Link></li> : ""}
                    {localStorage.getItem('user') === 'admin' ? <li><button onClick={() => deleteDoctor(doc.id)} className="list-actions-button-delete">{t('delete')}</button></li> : ""}
                </ul>
            </td>
        </tr>
    );
}