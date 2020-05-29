import React from 'react';
import './Feature.css';
const Feature = (props) => {
    return (
        <div className= {props.isClick? `feature feature-click` : 'feature'} onClick={()=>{props.onClick()}}>
            {props.type}
        </div>
    );
}

export default Feature;