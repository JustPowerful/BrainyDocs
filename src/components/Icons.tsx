import {
  LogIn,
  LogOut,
  LucideProps,
  UserRoundPlus,
  User,
  Menu,
  Ungroup,
  X,
  Plus,
  Check,
  Trash,
  Pen,
  UploadCloud,
  Files,
  Bot,
  Info,
  Eye,
  LucideStars,
} from "lucide-react";

export const Icons = {
  star: LucideStars,
  eye: Eye,
  info: Info,
  robot: Bot,
  document: Files,
  upload: UploadCloud,
  edit: Pen,
  delete: Trash,
  tick: Check,
  plus: Plus,
  close: X,
  class: Ungroup,
  menu: Menu,
  user: User,
  login: LogIn,
  logout: LogOut,
  register: UserRoundPlus,
  loading: (props: LucideProps) => (
    <svg
      {...props}
      fill="currentColor"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        margin: "auto",
        display: "block",
        shapeRendering: "auto",
      }}
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="currentColor"
        stroke-width="10"
        r="35"
        stroke-dasharray="164.93361431346415 56.97787143782138"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        />
      </circle>
    </svg>
  ),
};
