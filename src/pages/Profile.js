import {NavLink, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import NiceAvatar from "react-nice-avatar";
import {PatientDB} from "../DAL/PatientDB";
import {DoctorDB} from "../DAL/DoctorDB";


export default function Profile({currentUser, setBackgroundImage}) {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [doctors, setDoctors] = React.useState([]);

    //Default avatar config for users that don't have an avatar
    const defaultConfig = {
        "sex": "man",
        "faceColor": "#f5d6a1",
        "earSize": "small",
        "eyeStyle": "circle",
        "noseStyle": "short",
        "mouthStyle": "laugh",
        "shirtStyle": "hoody",
        "glassesStyle": "none",
        "hairColor": "#000000",
        "hairStyle": "normal",
        "hatStyle": "none",
        "hatColor": "#000000",
        "eyeBrowStyle": "up",
        "shirtColor": "#000000",
        "bgColor": "white",
    };

    useEffect(() => {
        setBackgroundImage(null);
        if (!currentUser) {
            navigate("/login");
            return;
        }
        getPatient();
        getDoctors();
    }, []);

    /**
     * Save new Firstname and Lastname to the DB
     * @returns {Promise<void>}
     */
    async function save() {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        await PatientDB.prototype.updatePatientName(currentUser.uid, firstName, lastName);
        alert("Profile saved!")

    }

    /**
     * Set selected doctor in state
     */
    const handleChange = () => {
        const doctorId = document.getElementById("selectDoctor").value;
        setUser({...user, ["doctorId"]: doctorId});
    }


    return (
        <div className={"padded_div avatarDiv"}>
            <h2>Profile</h2>
            <NiceAvatar id="avatar" shape={"rounded"}
                        style={{width: '10rem', height: '10rem'}} {...user?.avatarConfig || (defaultConfig)}/>
            <br/>
            <NavLink className={"homeGridButton"} to={"/editAvatar"}>Edit your avatar</NavLink>
            <div style={{marginBottom: "20px"}}/>
            <hr/>
            <div style={{marginBottom: "30px"}}/>
            <div className={"grid_2col"}>
                <label>Firstname</label>
                <input id={"firstName"} type="text" defaultValue={user?.firstName}/>
                <label>Lastname</label>
                <input id={"lastName"} type="text" defaultValue={user?.lastName}/>
            </div>
            <div style={{marginBottom: "30px"}}/>
            <button className={"homeGridButton"} onClick={save}>Save</button>
            <hr/>
            <div style={{marginBottom: "30px"}}/>
            <div className={"grid_2col"}>
                <label>Change/Choose Doctor</label>
                <select id={"selectDoctor"} value={user?.doctorId} onChange={handleChange}>
                    <option value={"none"}>None</option>
                    {optionsDoctors()}
                </select>
            </div>
            {user?.pendingDoctorId !== "" && user?.pendingDoctorId !== null && user?.pendingDoctorId !== undefined ?
                <div className={"PendingMessage"}>Your request has been registered</div> : null}
            <button className={"homeGridButton"} onClick={submitDoctor}>Submit Request</button>
        </div>
    )

    /**
     * Get the patient from the DB
     * @returns {Promise<void>}
     */
    async function getPatient() {
        const pat = await PatientDB.prototype.getPatientById(currentUser.uid);
        pat.prevDoctor = pat.doctorId;
        setUser(pat);
    }

    /**
     * Get all the doctors from the DB
     * @returns {Promise<void>}
     */
    async function getDoctors() {
        const docs = await DoctorDB.prototype.getAllDoctors();
        setDoctors(docs);
    }

    /**
     *  Submit a follow request to a doctor
     * @returns {Promise<void>}
     */
    async function submitDoctor() {
        const doctorId = document.getElementById("selectDoctor").value;
        if (doctorId === "none") {
            await PatientDB.prototype.updatePatientDoctor(currentUser.uid, null);
            await PatientDB.prototype.removePendingDoctor(currentUser.uid);
            await PatientDB.prototype.removeDoctor(currentUser.uid);
            if (user?.prevDoctor != null) {
                await DoctorDB.prototype.removePatientFromDoctor(user.prevDoctor, currentUser.uid);
                alert("Doctor removed!");
            }
            setUser({...user, ["prevDoctor"]: null});
        } else {
            await PatientDB.prototype.updatePendingDoctor(currentUser.uid, doctorId);
            await DoctorDB.prototype.addPendingPatientToDoctor(doctorId, currentUser.uid);
            setUser({...user, ["prevDoctor"]: doctorId});
            alert("Request submitted");
        }
        navigate("/profile")
    }

    /**
     * Generate the doctors options for the select
     * @returns {*[]}
     */
    function optionsDoctors() {
        let options = [];
        for (const doct of doctors) {
            const d = doct.data();
            let text = "Dr. " + d.firstName + " " + d.lastName;
            options.push(<option key={doct.id} value={doct.id}>{text}</option>)
        }
        return options;
    }
}