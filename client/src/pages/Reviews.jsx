import React from 'react'
import { useParams } from 'react-router-dom'

export default function Reviews() {
  const {reviewId} = useParams();

  return (
    <div>
      review page
    </div>
  )
}
