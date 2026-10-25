import mascotImg from '../../assets/poppy.png'
import './Mascot.css'

function Mascot({ size = 64, className = '' }) {
  return (
    <img
      src={mascotImg}
      alt="Poppy the mascot"
      width={size}
      height={size}
      className={`mascot ${className}`}
    />
  )
}

export default Mascot