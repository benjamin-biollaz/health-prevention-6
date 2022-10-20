import UserForm from "../components/UserForm";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../initFirebase";
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";
import {PatientDB} from "../DAL/PatientDB";
import {useState} from "react";

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleLastNameChange = (e) => setLastName(e.target.value);

    const handleRegister = async (e, email, password) => {
        e.preventDefault();

        try {
            //create user in auth section
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };

    //create a patient account using the newly generated auth id
    onAuthStateChanged(auth, (user) => {
        if (user) {
            let patient = {"FirstName": firstName, "LastName": lastName};
            PatientDB.prototype.addPatient(user.uid, patient);
        }
    });

    return (
        <div className="padded_div register centered_div">
            <div>
            <h3>Create a patient account to save your data !</h3>
                <p id="registerMessage">*Only registered patients can save their answers and custom avatar.</p>
            </div>

            <form
                onSubmit={(e) => {
                    handleRegister(e, email, password, firstName, lastName);
                }}
            >
                <input className="formInput"
                       type="text"
                       placeholder="email"
                       value={email}
                       onChange={handleEmailChange}
                       required
                />
                <br/>
                <input className="formInput"
                       type="password"
                       placeholder="password"
                       value={password}
                       onChange={handlePasswordChange}
                       required
                />
                <br/>
                <input className="formInput"
                       type="First name"
                       placeholder="First name"
                       value={firstName}
                       onChange={handleFirstNameChange}
                       required
                />
                <br/>
                <input className="formInput"
                       type="Last name"
                       placeholder="Last name"
                       value={lastName}
                       onChange={handleLastNameChange}
                       required
                />
                <br/>
                <button
                    type="submit"
                    className="formButton"
                >Register</button>
            </form>
        </div>
    );
}
