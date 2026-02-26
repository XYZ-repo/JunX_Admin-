import React from "react";

const sizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
  "2xl": "w-20 h-20 text-xl",
};

export default function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  status,
  className = "",
}) {
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const statusColors = {
    online: "#f8851a",
    offline: "rgba(29, 61, 100, 0.4)",
    busy: "#f8851a",
    away: "#1D3D64",
  };

  const statusSizes = {
    xs: "w-1.5 h-1.5 border",
    sm: "w-2 h-2 border",
    md: "w-2.5 h-2.5 border-2",
    lg: "w-3 h-3 border-2",
    xl: "w-4 h-4 border-2",
    "2xl": "w-5 h-5 border-2",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center font-medium`}
        style={{ backgroundColor: "rgba(29, 61, 100, 0.1)", color: "#1D3D64" }}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <span className={src ? "hidden" : "flex items-center justify-center"}>
          {getInitials(name)}
        </span>
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-white`}
          style={{ backgroundColor: statusColors[status] }}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

export function AvatarGroup({
  avatars = [],
  max = 4,
  size = "md",
  className = "",
}) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const overlapSizes = {
    xs: "-ml-1",
    sm: "-ml-2",
    md: "-ml-2.5",
    lg: "-ml-3",
    xl: "-ml-4",
    "2xl": "-ml-5",
  };

  return (
    <div className={`flex items-center ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={avatar.id || index}
          className={`${
            index > 0 ? overlapSizes[size] : ""
          } ring-2 ring-white rounded-full`}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`${overlapSizes[size]} ${sizes[size]} rounded-full flex items-center justify-center font-medium text-white ring-2 ring-white`}
          style={{ backgroundColor: "#1D3D64" }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
