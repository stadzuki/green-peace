import * as React from 'react';

function Pin({count, color}) {
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

    return el;
    
  }

  const CreatePin = () => {
    const svgMarker = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgMarker.appendChild(drSegment(`fill:red; stroke:black; stroke-width:3;`, 0/2, 0+1/2))
    return svgMarker;
  }

  // React.useEffect(() => {
  //   for(let i = 0; i < count; i++) {
  //     drSegment(`fill:${color[i]}; stroke:black; stroke-width:3;`, i/count, i+1/count)
  //   }
  //   drSegment('fill:red; stroke:black; stroke-width:3;', 0/6, 1/6)
  //   drSegment('fill:yellow; stroke:black; stroke-width:3;', 1/6, 2/6)
  //   drSegment('fill:black; stroke:black; stroke-width:3;', 2/6, 3/6)
  //   drSegment('fill:pink; stroke:black; stroke-width:3;', 3/6, 4/6)
  //   drSegment('fill:purple; stroke:black; stroke-width:3;', 4/6, 5/6)
  //   drSegment('fill:green; stroke:black; stroke-width:3;', 5/6, 6/6)
  // })

  return (
    <CreatePin/>
  );
}

export default Pin;