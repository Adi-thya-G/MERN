import React from 'react'

function TypeingIndicator() {
  return (
   <div className="flex gap-0.5 items-center">
  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounceDot"></div>
  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounceDot-delay-1"></div>
  <div className="w-2 h-2  rounded-full bg-blue-600 animate-bounceDot-delay-2"></div>
</div>

  )
}

export default TypeingIndicator