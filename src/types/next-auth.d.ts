import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

interface Session {
  user?: DefaultUser & { id: string; role: string };
}
interface User extends DefaultUser {
  role: string;
}
