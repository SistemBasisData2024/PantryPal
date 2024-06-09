import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export default function addReview() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { entityId } = useParams();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const entityType = /^\d+$/.test(entityId) ? "product" : "recipe";

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/reviews/add",
        {
          entityType: entityType,
          entityId: entityId,
          comment: comment,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
      if (response.status === 201) {
        toast("Success!", { position: "top-center" });
        navigate(-1);
        }
        } catch (error) {
      setIsLoading(false);
      toast("Error: " + error, { position: "top-center" });
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <form
        method="POST"
        className="w-full flex flex-col items-center"
        onSubmit={handleAddReview}
      >
        <div className="flex flex-col w-full border-2 border-black rounded-xl p-10">
          <label className="font-bold">Comment</label>
          <textarea
            type="text"
            className="rounded-lg my-1 border-2"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <label className="font-bold">Rating</label>
          <input
            type="number"
            className="rounded-lg my-1 border-2"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          />
        </div>
        <button className="bg-slate-400 rounded-lg my-5 w-52">
          {isLoading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
