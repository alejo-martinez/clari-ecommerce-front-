import React from 'react';

import './Arrow.css';

function Arrow (props){
    const {onClick, className, style} = props;
    return(
        <div className={className} onClick={onClick} style={{...style, display:'block', backgroundColor:'blue'}}>
        </div>
    )
}

export default Arrow;