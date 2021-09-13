import * as React from 'react';

const els = [];
function Pin({count, color}) {
  // const [markerUI, setMarkerUI] = React.useState('');

  const drSegment = function (style, ange1, ange2) {

    var dir = "0";
    if (angle2 - angle1 > 0.5 ) dir = "1";
    var angle1 = Math.PI * 2 * ange1;
    var angle2 = Math.PI * 2 * ange2;
    
    var rad=300, cx=350, cy=350;
    
    var dx1 = Math.sin(angle1) * rad + cx;
    var dy1 = -Math.cos(angle1) * rad + cy;
    
    var dx2 = Math.sin(angle2) * rad + cx;
    var dy2 = -Math.cos(angle2) * rad + cy; 
    
    var el= document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    el.setAttribute('style', style);
    el.setAttribute('d', ' M '+dx1+','+dy1+' A '+rad+','+rad+' 0 ' + dir + ' 1 ' + dx2 + ',' + dy2 + ' L '+cx+','+cy+' Z');

    console.log(el);
    return el;
  }

  const CreatePin = () => {
    // const svgMarker = document.createElement("svg");
    for(let i = 0; i < count; i++) {
      // svgMarker.appendChild(drSegment(`fill:${color[i]}; stroke:black; stroke-width:3;`, i/count, i+1/count))
      els.push(drSegment(`fill:${color[i]}; stroke:black; stroke-width:3;`, i/count, i+1/count))
    }

    // return (
    //   <React.Fragment>{svgMarker}</React.Fragment>
    // )
  }
  CreatePin()
  console.log(...els)
  return (
    <svg>
      <path style={{fill: 'red', stroke: 'red', strokeWidth:3}} d=" M 350,50 A 300,300 0 0 1 350.00000000000006,650 L 350,350 Z"></path>
    </svg>
  );
}

export default Pin;