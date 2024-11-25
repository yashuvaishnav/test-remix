import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, Link, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { db } from "~/utils/db.server";
import getUser from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const jokeListItems = await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 5,
  });
  const user = await getUser(request);

  return json({ jokeListItems, user });
};


const Blogs = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="w-full mb-[30px] text-center text-[32px] font-bold">
        <div className="flex justify-around bg-blue-800 py-[10px] text-white">
          <h1 className=" text-center text-[32px] font-bold"><Link to={'/blogs'}>J🤪KES</Link></h1>
          {data.user ? (
            <div className="user-info items-center  w-[15%] flex justify-between border-gray-300">
              <span className="font-300 text-[20px]">{`Hi, ${data.user.username}`}</span>
              <Form action="/logout" className="flex items-center" method="post">
                <button type="submit" className="button px-[10px] font-300 text-[20px] outline-none border-2 rounded-md hover:text-black hover:border-none">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login" className="outline-none hover:underline border-2 border-gray-500 text-gray-100 px-[20px] rounded-md ">Login</Link>
          )}
        </div>
      </div>
      <div className="flex grid grid-cols-3">
        <div>
          <button className="border-2 border-blue-500 text-blue-500 bg-white px-4 py-2 rounded-md ml-[30px] my-[20px] font-bold hover:bg-blue-500 hover:text-white transition-colors">
            <Link to=".">Get a random joke</Link>
          </button>
          <div className=" ml-[30px] mb-[30px]">
            <ul>
              {data.jokeListItems.map((joke, i) => (
                <li key={joke.id}>
                  {`${i + 1}) `}
                  <Link prefetch="intent" to={joke.id} className="hover:text-blue-500">
                    {joke.name}
                  </Link>
                </li>
              ))}
            </ul>
            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 mt-[10px]">
              <Link to={"new"}>Add new Jokes</Link>
            </button>
          </div>
        </div>
        <div className="ml-[20px] flex justify-center items-center">
          <Outlet />
        </div>
        <footer className="jokes-footer">
          <div className="container">
            <Link reloadDocument to="/jokes.rss">
              RSS
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default Blogs;
