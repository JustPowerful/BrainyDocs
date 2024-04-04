import { FC } from "react";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Icons } from "@/components/Icons";

interface pageProps {}

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user?.email!,
    },
  });

  // get the leaderboard limited to 10 users
  // check if the user is in the leaderboard
  // get the user's position in the leaderboard even if it's not in the top 10
  const leaderboard = await db.user.findMany({
    take: 10,
    orderBy: {
      xp: "desc",
    },
  });

  return (
    <div className="p-10">
      <p className="text-rose-600 flex items-center gap-1">
        <Icons.user className="w-4 h-4" /> current user
      </p>
      <h1 className="text-3xl font-semibold">
        {user?.firstname} {user?.lastname}
      </h1>
      <p className="mt-5 text-rose-600 flex items-center gap-1">
        <Icons.xp className="w-4 h-4" /> user xp
      </p>
      <h1 className="text-3xl font-semibold">
        {user?.xp} {user?.xp === 1 ? "point" : "points"}
      </h1>

      <p className="mt-5 text-rose-600 flex items-center gap-1">
        <Icons.users className="w-4 h-4" /> leaderboard
      </p>
      <div className="flex flex-col ">
        {leaderboard.map((user, index) => (
          <div
            key={user.id}
            className="flex justify-between items-center border-b border-gray-200 py-2"
          >
            <p>
              {index + 1}. {user.firstname} {user.lastname}
            </p>
            <p>{user.xp} points</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
