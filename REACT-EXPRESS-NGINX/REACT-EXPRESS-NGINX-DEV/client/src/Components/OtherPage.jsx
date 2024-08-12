import { Link } from "react-router-dom";
function OtherPage() {
  return (
    <div>
      I'm an other page!
      <br />
      <br />
      <Link to="/">Go back to home screen</Link>
    </div>
  )
}

export default OtherPage