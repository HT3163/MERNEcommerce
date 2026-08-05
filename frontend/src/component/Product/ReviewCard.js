import React from "react";
import { Rating } from "@material-ui/lab";
import profilePng from "../../images/Profile.png";

const COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#8b5cf6", "#0ea5e9", "#f97316", "#14b8a6",
];

/* Simple hash to pick a consistent accent color per reviewer name */
const nameColor = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % COLORS.length;
  return COLORS[h];
};

const ReviewCard = ({ review }) => {
  const color    = nameColor(review.name);
  const initials = review.name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

  /* Format date if available */
  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : null;

  return (
    <div className="pd-review-card">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar — initials fallback or real image */}
        {review.avatar?.url ? (
          <img
            src={review.avatar.url}
            alt={review.name}
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: color, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700, fontSize: "0.85rem",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}

        {/* Name + date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p
              className="font-semibold text-gray-800 text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {review.name}
            </p>
            {dateStr && (
              <span
                className="text-xs text-gray-400"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {dateStr}
              </span>
            )}
          </div>
          <Rating value={review.rating} readOnly precision={0.5} size="small" />
        </div>
      </div>

      {/* Comment body */}
      <p
        className="text-sm text-gray-600 leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
      >
        {review.comment}
      </p>

      {/* Verified badge */}
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "#f0fdf4", color: "#15803d", fontFamily: "'Inter', sans-serif" }}
        >
          ✓ Verified Purchase
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
