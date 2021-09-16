import * as React from 'react';

function Pin({count, color}) {
  return (
    <svg 
      style={{minWidth: '50px', position: 'absolute'}}
      width="50"
      height="50"
      viewBox="0 0 50 50">
      {count.map((c, idx) => {
        const size = Math.ceil(100 / count.length);
        const offset = Math.ceil(size*(-idx)) 
        
        const pinStyle = {
          fill: 'none',
          strokeWidth: 10,
          stroke: color[idx],
          strokeDasharray: `${size} 100`,
          strokeDashoffset: offset
        }

        return (
          <circle 
            style={pinStyle} 
            r="15.9" 
            cx="50%" 
            cy="50%"
          ></circle>
        )
      })}
    </svg>
  );
}

export default Pin;