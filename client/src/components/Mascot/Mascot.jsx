import poppyIcon from '../../assets/poppy-icon.png'
import poppyThink from '../../assets/poppy-think.png'
import './Mascot.css'

// lookup table: mood name → image
const IMAGES = {
  happy: poppyIcon,
  thinking: poppyThink,
}

function Mascot({ mood = 'happy', size = 100, className = '' }) {
  return (
    <img
      src={IMAGES[mood]}
      alt={mood === 'thinking' ? 'Poppy thinking' : 'Poppy the mascot'}
      width={size}
      height={size}
      className={`mascot ${className}`}
    />
  )
}

export default Mascot