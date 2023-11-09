import { ResponseType } from "@/types/api"
import { useEffect, useState } from "react"

const MOVEMENTS = { STOP: 0, FORWARD: 1, BACKWARD: 2, RIGHT: 3, LEFT: 4 }

export const Controls = () => {
  const [CurrentMovement, setCurrentMovement] = useState(MOVEMENTS.STOP)
  const [Speed, setSpeed] = useState(0)

  const setData = async () => {
    const speedReq = await fetch("/api/data")
    const json = await speedReq.json() as ResponseType
    if (json.status === "Error") return
    setSpeed(json.speed)
    setCurrentMovement(json.movement)
  }

  useEffect(() => {
    setData()
  }, [])

  async function changeMovement(value: number) {
    await fetch("/api/data", {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movement: value })
    })
    setCurrentMovement(value)
  }

  async function changeSpeed(speed: number) {
    await fetch("/api/data", {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ speed })
    })
    setSpeed(speed)
  }

  return (
    <div className="container">
      <h1>Robot Controls</h1>
      <button
        className={CurrentMovement === MOVEMENTS.FORWARD ? "active" : ""}
        onClick={() => changeMovement(MOVEMENTS.FORWARD)}
      >
        <i className="fas fa-arrow-up" />
      </button>
      <br />
      <button
        className={CurrentMovement === MOVEMENTS.LEFT ? "active" : ""}
        onClick={() => changeMovement(MOVEMENTS.LEFT)}
      >
        <i className="fas fa-arrow-left" />
      </button >
      <button
        className={`stop ${CurrentMovement === MOVEMENTS.STOP ? "active" : ""}`}
        onClick={() => changeMovement(MOVEMENTS.STOP)}
      >
        <i className="fas fa-stop" />
      </button>
      <button
        className={CurrentMovement === MOVEMENTS.RIGHT ? "active" : ""}
        onClick={() => changeMovement(MOVEMENTS.RIGHT)}
      >
        <i className="fas fa-arrow-right" />
      </button>
      <br />
      <button
        className={CurrentMovement === MOVEMENTS.BACKWARD ? "active" : ""}
        onClick={() => changeMovement(MOVEMENTS.BACKWARD)}
      >
        <i className="fas fa-arrow-down"></i>
      </button>
      <div className="slider">
        <h3>
          PWM Speed: {Speed}
        </h3>
        <input
          type="range"
          min="0"
          max="255"
          step="15"
          id="slider"
          value={Speed}
          onChange={(e) => changeSpeed(Number(e.target.value))}
        />
      </div>
    </div >
  )
}
