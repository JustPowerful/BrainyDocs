import { FC } from "react";

interface pageProps {
  params: { id: string };
}

const page: FC<pageProps> = ({ params }) => {
  return <div className="p-8"></div>;
};

export default page;
