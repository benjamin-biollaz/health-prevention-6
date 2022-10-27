import React from "react";
import Algorithm from "../algorithm/Algorithm";
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';


const v = [1, 100 ,70 ,179 , 0, 110 , 0, 5.0, 0, 3.0, 2.0, 0, 0,/*avc*/ 0, 0, 0, 0, 1 , 2, 2];
const now=60;

export default class MyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            algorithm: new Algorithm(v)
        };
        console.log("infactus"+this.state.algorithm.infRate);
        console.log("dia"+this.state.algorithm.diaRate);
        console.log("can"+this.state.algorithm.canRate);
        console.log(this.state.algorithm.CalculateCancer());
        console.log("Constr: " + this.state.algorithm);
     }
    handleInputBool = (e) => {
        this.setState(s => ({algorithm: {...s.algorithm, [e.target.name]: s.algorithm.fume===0?1:0}}));
    }
    changeAlim = () => {
        this.setState(s =>({algorithm: {...s.algorithm, infRate: s.algorithm.infRate+(s.algorithm.alim-document.getElementById("alim").value)*s.algorithm.modifAlimTauxInf}}));
        this.setState(s =>({algorithm: {...s.algorithm, alim: document.getElementById("alim").value}}));
        this.setState(s =>({algorithm: {...s.algorithm, diaRate: s.algorithm.CalculateDiabete()}}));
        this.setState(s =>({algorithm: {...s.algorithm, canRate: s.algorithm.CalculateCancer()}}));

    };

    changeSport = () => {
        this.setState(s =>({algorithm: {...s.algorithm, sport: document.getElementById("sport").value}}))
    }
    /*changeSport = () => {
        this.setState(s =>({algorithm: {...s.algorithm, sport: document.getElementById("sport").value}}))
    }*/

    render() {
        return(
            <>
                <div className={"header"}>
                    <h1>Your statistics:</h1>
                    <ProgressBar now={now} label={`${now}%`}/>
                </div>
                <div className={"situation"}>
                    <h2>Your situation</h2>
                    <p>*photo avatar*</p>
                </div>
                <div className={"rhythm"}>
                    <h2>Your rhythm</h2>
                    <p>*photo avatar*</p>

                    <p>Smoker <input type={"checkbox"} placeholder={`${this.state.algorithm.fume}`} name="fume" onClick={this.handleInputBool}/><br/></p>
                    <ProgressBar name={"fume"} min={0} max={1} now={this.state.algorithm.fume} onChange={e => this.handleClickWeight(e)}/>

                    <label>Healthy Food:</label>
                    <select name="alim" id="alim" onChange={this.changeAlim} value={this.state.algorithm.alim}>
                        <option value={0}>Never</option>
                        <option value={1}>From time to time</option>
                        <option value={2}>Frequently</option>
                        <option value={3}>Most of the time</option>
                    </select><br/>
                    <ProgressBar name={"alim"} min={0} max={3} now={this.state.algorithm.alim} onChange={e => this.handleClickWeight(e)}/>

                    <label>Physical activity:</label>
                    <select name="sport" id="sport" onChange={this.changeSport} value={this.state.algorithm.sport}>
                        <option value={0}>I don't move around much</option>
                        <option value={1}>Half an hour of physical activity 2-3 days a week</option>
                        <option value={2}>Half an hour of physical activity 5 days a week</option>
                        <option value={3}>More than 2 hours of intense activity a week</option>
                    </select><br/>
                    <ProgressBar name={"sport"} min={0} max={3} now={this.state.algorithm.sport} onChange={e => this.handleClickWeight(e)}/>

                    <p>Weight <input type={"number"} placeholder={`${this.state.algorithm.poids}`} name="poids" onChange={this.handleInputChanges}/><br/></p>
                    <ProgressBar name={"poids"} min={50} max={180} now={this.state.algorithm.poids} onChange={e => this.handleClickWeight(e)}/>

                    <p>Alcohol <input type={"number"} placeholder={`${this.state.algorithm.alcool}`} name="alcool" onChange={this.handleInputChanges}/><br/></p>
                    <ProgressBar name={"alcool"} min={0} max={4} now={this.state.algorithm.alcool} onChange={e => this.handleClickWeight(e)}/>
                </div>
                <div className={"risks"}>
                    <h2>Your risks</h2>
                    <p>*photo avatar*</p>
                    <p>Stroke</p> <ProgressBar now={this.state.algorithm.infRate}/>
                    <p>Diabetes</p> <ProgressBar now={this.state.algorithm.diaRate}/>
                    <p>Cancer</p> <ProgressBar now={this.state.algorithm.canRate}/>
                </div>
            </>
        )
     }

    handleClickWeight(e) {
        console.log([e.target.name]+":" + e.target.value);
        this.setState(s=> ({algorithm: {...s.algorithm, [e.target.name]: e.target.value}}));
    }
}
