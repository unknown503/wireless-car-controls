import { ResponseType } from '@/types/api';
import type { NextApiRequest, NextApiResponse } from 'next'

let movement: number = 0
let speed: number = 80

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    res.status(200).json({ status: "Success", speed, movement })
  } else if (req.method === 'POST') {
    const { movement: newMovement, speed: newSpeed } = req.body;
    
    if (newMovement !== undefined && newMovement !== "") movement = newMovement
    if (newSpeed !== undefined && newSpeed !== "") speed = newSpeed
    res.status(200).json({ status: "Success", speed, movement })
  } else {
    res.status(401).json({ status: "Error", message: "There was an error" })
  }
}
