import { json, Link, useLoaderData,isRouteErrorResponse,useRouteError } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });
  if(!randomJoke){
    if (!randomJoke) {
      throw new Response("No random joke found", {
        status: 404,
      });
    }
  }
  return json({ randomJoke });
  
};
const BlogsIndexRoute = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-[32px] font-bold ">Blog Index Route</h1>

      <div className="flex flex-col space-y-4 mt-[30px] ml-[20px] border-t-2 border-gray-200 shadow-md p-[10px]">
        <h1 className="mr-4 text-[32px]">Here's a random joke:</h1>
        <p className="mr-4">{data.randomJoke.content}</p>
        <Link to={data.randomJoke.id} className="mr-4">
          "{data.randomJoke.name}" Permalink
        </Link>
      </div>
    </div>
  );
};
export default BlogsIndexRoute;


export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        <p>There are no jokes to display.</p>
        <Link to="new">Add your own</Link>
      </div>
    );
  }
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}