import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Reviews() {
  const { entityId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axios.get("/reviews/" + entityId);
        setReviews(response.data);
        console.log(response.data);
      } catch (error) {
        toast.error(error);
      }
    };
    getReviews();
  }, []);
  return (<div className="p-10">
    {(reviews && reviews.length > 0) ? reviews.map((review) => (
      <div key={reviews._id} className="border rounded-lg my-2 p-5">
        <h3 className="text-lg mb-3">User {review.user_id}</h3>
        <h3 className="font-bold">Rating {review.rating.toFixed(2)}</h3>
        <h3 className="font-bold">Comment</h3>
        <p className="w-full h-30 rounded-md">
        {review.comment}
        </p>
        <p className="w-full text-sm h-30 rounded-md mt-5">
        {review.createdAt}
        </p>
      </div>
    ))
      :
    (
      <p>No Reviews Found</p>
    )
    }
  </div>);
}
