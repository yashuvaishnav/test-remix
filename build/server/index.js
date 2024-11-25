import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, redirect, json as json$1 } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useRouteError, isRouteErrorResponse, json, useLoaderData, Link, Form, useParams, useActionData, useSearchParams } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState } from "react";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const meta$3 = () => {
  const description = "Learn Remix and laugh at the same time!";
  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix: So great, it's funny!" }
  ];
};
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Document({
  children,
  title = "Remix: So great, it's funny!"
}) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "Remix,jokes" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "twitter:image",
          content: "https://remix-jokes.lol/social.png"
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "twitter:card",
          content: "summary_large_image"
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "twitter:creator", content: "@remix_run" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@remix_run" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Remix Jokes" }),
      /* @__PURE__ */ jsx(Meta, {}),
      title ? /* @__PURE__ */ jsx("title", { children: title }) : null,
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Document, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function ErrorBoundary$3() {
  const error = useRouteError();
  console.log(error);
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ jsx(
      Document,
      {
        title: `${error.status} ${error.statusText}`,
        children: /* @__PURE__ */ jsx("div", { className: "error-container", children: /* @__PURE__ */ jsxs("h1", { children: [
          error.status,
          " ",
          error.statusText
        ] }) })
      }
    );
  }
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return /* @__PURE__ */ jsx(Document, { title: "Uh-oh!", children: /* @__PURE__ */ jsxs("div", { className: "error-container", children: [
    /* @__PURE__ */ jsx("h1", { children: "App Error" }),
    /* @__PURE__ */ jsx("pre", { children: errorMessage })
  ] }) });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$3,
  default: App,
  links,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const singleton = (name, valueFactory) => {
  var _a;
  const g = global;
  g.__singletons ?? (g.__singletons = {});
  (_a = g.__singletons)[name] ?? (_a[name] = valueFactory());
  return g.__singletons[name];
};
const db = singleton(
  "prisma",
  () => new PrismaClient()
);
async function register({
  password,
  username
}) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { passwordHash, username }
  });
  return { id: user.id, username };
}
async function login({ username, password }) {
  const user = await db.user.findUnique({
    where: { username }
  });
  if (!user) {
    return null;
  }
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return null;
  }
  return { id: user.id, username };
}
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
});
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function getUserId(request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
const getUser = async (request) => {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  const user = await db.user.findUnique({
    select: { id: true, username: true },
    where: { id: userId }
  });
  if (!user) {
    throw await logout(request);
  }
  return user;
};
async function logout(request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}
async function createUserSession(userId, redirectTo) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
const meta$2 = ({
  data
}) => {
  const { description, title } = data ? {
    description: `Enjoy the "${data.joke.name}" joke and much more`,
    title: `"${data.joke.name}" joke`
  } : { description: "No joke found", title: "No joke" };
  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title }
  ];
};
const loader$5 = async ({ params, request }) => {
  const userId = await getUserId(request);
  const res = await db.joke.findUnique({
    where: { id: params.blogId }
  });
  if (!res) {
    throw new Response("What a joke! Not found.", {
      status: 404
    });
  }
  return json({ joke: res, isOwner: userId === res.jokesterId });
};
const action$4 = async ({ params, request }) => {
  const form = await request.formData();
  console.log("form data::", form);
  const name = form.get("name");
  const content = form.get("content");
  const action2 = form.get("action");
  switch (action2) {
    case "update_todo":
      return await db.joke.update({
        where: { id: params.blogId },
        data: {
          name: name == null ? void 0 : name.toLowerCase(),
          content: content == null ? void 0 : content.toLowerCase()
        }
      });
  }
  if (form.get("intent") !== "delete") {
    throw new Response(
      `The Intent ${form.get("intent")} is not supported`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.blogId }
  });
  if (!joke) {
    throw new Response("Can't delete what does not exist", {
      status: 404
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      "Pssh, nice try. That's not your joke",
      { status: 403 }
    );
  }
  await db.joke.delete({ where: { id: params.blogId } });
  return redirect("/blogs");
};
const SingleBlog = () => {
  const { joke, isOwner } = useLoaderData();
  const [edit, setEdit] = useState(false);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-[32px] font-bold ", children: "Single Blog" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg shadow-md bg-white mt-[20px]", children: [
      joke ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Link, { to: ".", children: /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-semibold text-gray-800 mb-2", children: [
          "Name: ",
          joke.name
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700", children: joke.content })
      ] }) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 italic", children: "Loading..." }),
      isOwner ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
            name: "intent",
            type: "submit",
            value: "delete",
            children: "Delete"
          }
        ) }),
        edit && /* @__PURE__ */ jsxs(Form, { method: "POST", children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "action", value: "update_todo" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "name", defaultValue: joke ? joke.name : "" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "content", defaultValue: joke ? joke.content : "" }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("button", { type: "submit", children: "submit" }),
          /* @__PURE__ */ jsxs("span", { onClick: () => setEdit(false), children: [
            "              ",
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18 18 6M6 6l12 12" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", onClick: () => setEdit(true), children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }) }) })
      ] }) : null
    ] })
  ] });
};
function ErrorBoundary$2() {
  const { blogId } = useParams();
  const error = useRouteError();
  console.log(error);
  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return /* @__PURE__ */ jsx("div", { className: "error-container", children: "What you're trying to do is not allowed." });
    }
    if (error.status === 403) {
      return /* @__PURE__ */ jsxs("div", { className: "error-container", children: [
        'Sorry, but "',
        blogId,
        '" is not your joke.'
      ] });
    }
    if (error.status === 404) {
      return /* @__PURE__ */ jsxs("div", { className: "error-container", children: [
        'Huh? What the heck is "',
        blogId,
        '"?'
      ] });
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "error-container", children: [
    'There was an error loading joke by the id "$',
    blogId,
    '". Sorry.'
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$2,
  action: action$4,
  default: SingleBlog,
  loader: loader$5,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1
  });
  if (!randomJoke) {
    if (!randomJoke) {
      throw new Response("No random joke found", {
        status: 404
      });
    }
  }
  return json({ randomJoke });
};
const BlogsIndexRoute = () => {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { className: "text-[32px] font-bold ", children: "Blog Index Route" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-4 mt-[30px] ml-[20px] border-t-2 border-gray-200 shadow-md p-[10px]", children: [
      /* @__PURE__ */ jsx("h1", { className: "mr-4 text-[32px]", children: "Here's a random joke:" }),
      /* @__PURE__ */ jsx("p", { className: "mr-4", children: data.randomJoke.content }),
      /* @__PURE__ */ jsxs(Link, { to: data.randomJoke.id, className: "mr-4", children: [
        '"',
        data.randomJoke.name,
        '" Permalink'
      ] })
    ] })
  ] });
};
function ErrorBoundary$1() {
  const error = useRouteError();
  console.log(error);
  if (isRouteErrorResponse(error) && error.status === 404) {
    return /* @__PURE__ */ jsxs("div", { className: "error-container", children: [
      /* @__PURE__ */ jsx("p", { children: "There are no jokes to display." }),
      /* @__PURE__ */ jsx(Link, { to: "new", children: "Add your own" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "error-container", children: "I did a whoopsies." });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  default: BlogsIndexRoute,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
function escapeCdata(s) {
  return s.replace(/\]\]>/g, "]]]]><![CDATA[>");
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const loader$3 = async ({
  request
}) => {
  const jokes = await db.joke.findMany({
    include: { jokester: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  const domain = `${protocol}://${host}`;
  const jokesUrl = `${domain}/jokes`;
  const rssString = `
    <rss xmlns:blogChannel="${jokesUrl}" version="2.0">
      <channel>
        <title>Remix Jokes</title>
        <link>${jokesUrl}</link>
        <description>Some funny jokes</description>
        <language>en-us</language>
        <generator>Kody the Koala</generator>
        <ttl>40</ttl>
        ${jokes.map(
    (joke) => `
            <item>
              <title><![CDATA[${escapeCdata(
      joke.name
    )}]]></title>
              <description><![CDATA[A funny joke called ${escapeHtml(
      joke.name
    )}]]></description>
              <author><![CDATA[${escapeCdata(
      joke.jokester.username
    )}]]></author>
              <pubDate>${joke.createdAt.toUTCString()}</pubDate>
              <link>${jokesUrl}/${joke.id}</link>
              <guid>${jokesUrl}/${joke.id}</guid>
            </item>
          `.trim()
  ).join("\n")}
      </channel>
    </rss>
  `.trim();
  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(
        Buffer.byteLength(rssString)
      )
    }
  });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const badRequest = (data) => json$1(data, { status: 400 });
const loader$2 = async ({
  request
}) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return json$1({});
};
function validateJokeContent(content) {
  if (content.length < 20) {
    return "That joke is too short";
  }
}
function validateJokeName(name) {
  if (name.length < 5) {
    return "That joke's name is too short";
  }
}
const action$3 = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  const userId = await requireUserId(request);
  if (typeof content !== "string" || typeof name !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null
    });
  }
  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name)
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields
    });
  }
  const joke = await db.joke.create({ data: { ...fields, jokesterId: userId } });
  return redirect(`/blogs/${joke.id}`);
};
const AddBlogs = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { className: "text-[32px] text-gray-400 font-bold", children: "Add Blogs" }),
    /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-gray-700 font-medium mb-1", children: [
          "Name:",
          /* @__PURE__ */ jsx(
            "input",
            {
              defaultValue: (_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.name,
              type: "text",
              name: "name",
              "aria-invalid": Boolean((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.name),
              "aria-errormessage": ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.name) ? "name-error" : void 0,
              className: "w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            }
          )
        ] }),
        ((_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.name) ? /* @__PURE__ */ jsx("p", { className: "form-validation-error text-red-500", id: "name-error", role: "alert", children: actionData.fieldErrors.name }) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-gray-700 font-medium mb-1", children: [
          "Content:",
          /* @__PURE__ */ jsx(
            "textarea",
            {
              defaultValue: (_e = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _e.content,
              name: "content",
              "aria-invalid": Boolean((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.content),
              "aria-errormessage": ((_g = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _g.content) ? "content-error" : void 0,
              className: "w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            }
          )
        ] }),
        ((_h = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _h.content) ? /* @__PURE__ */ jsx(
          "p",
          {
            className: "form-validation-error text-red-500",
            id: "content-error",
            role: "alert",
            children: actionData.fieldErrors.content
          }
        ) : null
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600",
          children: "Add"
        }
      ) })
    ] }) })
  ] });
};
function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);
  if (isRouteErrorResponse(error) && error.status === 401) {
    return /* @__PURE__ */ jsxs("div", { className: "error-container p-4 rounded-md shadow-lg border-t-2", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-[20px]", children: "You must be logged in to create a joke." }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/login",
          className: "text-blue-500 font-semibold border-2 border-blue-500 py-[7px] px-[15px] rounded-md mt-[20px] hover:text-blue-700 hover:border-blue-700",
          children: "Login"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "error-container", children: "Something unexpected went wrong. Sorry about that." });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  action: action$3,
  default: AddBlogs,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};
function Index() {
  return /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "content", children: [
    /* @__PURE__ */ jsxs("h1", { children: [
      "Remix ",
      /* @__PURE__ */ jsx("span", { children: "Jokes!" })
    ] }),
    /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "blogs", children: "Read Jokes" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { reloadDocument: true, to: "/blogs.rss", children: "RSS" }) })
    ] }) })
  ] }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({
  request
}) => logout(request);
const loader$1 = async () => redirect("/");
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({
  request
}) => {
  const jokeListItems = await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 5
  });
  const user = await getUser(request);
  return json({ jokeListItems, user });
};
const Blogs = () => {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "w-full mb-[30px] text-center text-[32px] font-bold", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-around bg-blue-800 py-[10px] text-white", children: [
      /* @__PURE__ */ jsx("h1", { className: " text-center text-[32px] font-bold", children: /* @__PURE__ */ jsx(Link, { to: "/blogs", children: "J🤪KES" }) }),
      data.user ? /* @__PURE__ */ jsxs("div", { className: "user-info items-center  w-[15%] flex justify-between border-gray-300", children: [
        /* @__PURE__ */ jsx("span", { className: "font-300 text-[20px]", children: `Hi, ${data.user.username}` }),
        /* @__PURE__ */ jsx(Form, { action: "/logout", className: "flex items-center", method: "post", children: /* @__PURE__ */ jsx("button", { type: "submit", className: "button px-[10px] font-300 text-[20px] outline-none border-2 rounded-md hover:text-black hover:border-none", children: "Logout" }) })
      ] }) : /* @__PURE__ */ jsx(Link, { to: "/login", className: "outline-none hover:underline border-2 border-gray-500 text-gray-100 px-[20px] rounded-md ", children: "Login" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex grid grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("button", { className: "border-2 border-blue-500 text-blue-500 bg-white px-4 py-2 rounded-md ml-[30px] my-[20px] font-bold hover:bg-blue-500 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(Link, { to: ".", children: "Get a random joke" }) }),
        /* @__PURE__ */ jsxs("div", { className: " ml-[30px] mb-[30px]", children: [
          /* @__PURE__ */ jsx("ul", { children: data.jokeListItems.map((joke, i) => /* @__PURE__ */ jsxs("li", { children: [
            `${i + 1}) `,
            /* @__PURE__ */ jsx(Link, { prefetch: "intent", to: joke.id, className: "hover:text-blue-500", children: joke.name })
          ] }, joke.id)) }),
          /* @__PURE__ */ jsx("button", { className: "bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 mt-[10px]", children: /* @__PURE__ */ jsx(Link, { to: "new", children: "Add new Jokes" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ml-[20px] flex justify-center items-center", children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx("footer", { className: "jokes-footer", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(Link, { reloadDocument: true, to: "/jokes.rss", children: "RSS" }) }) })
    ] })
  ] });
};
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Blogs,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  const description = "Login to submit your own jokes to Remix Jokes!";
  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix Jokes | Login" }
  ];
};
function validateUsername$1(username) {
  if (username.length < 3) {
    return "Usernames must be at least 3 characters long";
  }
}
function validatePassword$1(password) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}
function validateUrl$1(url) {
  const urls = ["/blogs", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/blogs";
}
const action$1 = async ({
  request
}) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const password = form.get("password");
  const username = form.get("username");
  const redirectTo = validateUrl$1(
    form.get("redirectTo") || "/blogs"
  );
  if (typeof loginType !== "string" || typeof password !== "string" || typeof username !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly."
    });
  }
  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword$1(password),
    username: validateUsername$1(username)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null
    });
  }
  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Username/Password combination is incorrect"
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username }
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`
        });
      }
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Something went wrong trying to create a new user."
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Login type invalid"
      });
    }
  }
};
const Login$1 = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center pt-[50px]", children: [
    /* @__PURE__ */ jsxs("div", { className: " mb-[30px] flex justify-between w-[24%]", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:underline text-blue-400", children: "Home" }),
      /* @__PURE__ */ jsx(Link, { to: "/blogs", className: "hover:underline text-blue-400", children: "Blogs" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-md shadow-md border-t border-gray-2   00", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-center text-xl font-bold  text-[32px] p-[10px]", children: "Login" }),
      /* @__PURE__ */ jsxs(Form, { method: "post", className: "", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "redirectTo",
            value: searchParams.get("redirectTo") ?? ""
          }
        ),
        /* @__PURE__ */ jsxs("fieldset", { className: "flex justify-center mt-4", children: [
          /* @__PURE__ */ jsx("legend", { className: "sr-only", children: "Login or Register?" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-[60%]", children: [
            /* @__PURE__ */ jsxs("label", { children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "loginType", value: "login", defaultChecked: !((_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.loginType) || ((_b = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _b.loginType) === "login" }),
              " Login"
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "loginType", value: "register", className: "font-[25px]", defaultChecked: ((_c = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _c.loginType) === "register" }),
              " Register"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[22px] font-bold my-[10px] ", children: "Username" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "username-input",
              name: "username",
              placeholder: "User Name",
              className: "p-[8px] pl-[10px] border outline-none rounded-md",
              defaultValue: (_d = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _d.username,
              "aria-invalid": Boolean(
                (_e = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e.username
              ),
              "aria-errormessage": ((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.username) ? "username-error" : void 0
            }
          ),
          ((_g = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _g.username) ? /* @__PURE__ */ jsx(
            "p",
            {
              className: "form-validation-error text-red-500 ",
              role: "alert",
              id: "username-error",
              children: actionData.fieldErrors.username
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col ", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[22spx] font-bold my-[10px] ", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password-input",
              name: "password",
              placeholder: "Password",
              type: "password",
              className: "p-[8px] pl-[10px] border outline-none rounded-md",
              defaultValue: (_h = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _h.password,
              "aria-invalid": Boolean(
                (_i = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _i.password
              ),
              "aria-errormessage": ((_j = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _j.password) ? "password-error" : void 0
            }
          ),
          ((_k = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _k.password) ? /* @__PURE__ */ jsx(
            "p",
            {
              className: "form-validation-error text-red-500 ",
              role: "alert",
              id: "password-error",
              children: actionData.fieldErrors.password
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center mt-[10px] ", children: [
          /* @__PURE__ */ jsx("div", { id: "form-error-message", children: (actionData == null ? void 0 : actionData.formError) ? /* @__PURE__ */ jsx(
            "p",
            {
              className: "form-validation-error",
              role: "alert",
              children: actionData.formError
            }
          ) : null }),
          /* @__PURE__ */ jsx("button", { className: "px-6 py-2 border outline-none bg-blue-400 text-white font-bold rounded-md", children: "Submit" })
        ] })
      ] })
    ] })
  ] });
};
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: Login$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function validateUsername(username) {
  if (username.length < 3) {
    return "Usernames must be at least 3 characters long";
  }
}
function validatePassword(password) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}
function validateUrl(url) {
  const urls = ["/jokes", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/jokes";
}
const action = async ({
  request
}) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const password = form.get("password");
  const username = form.get("username");
  validateUrl(
    form.get("redirectTo") || "/jokes"
  );
  if (typeof loginType !== "string" || typeof password !== "string" || typeof username !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly."
    });
  }
  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null
    });
  }
  switch (loginType) {
    case "login": {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Not implemented"
      });
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username }
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`
        });
      }
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Not implemented"
      });
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Login type invalid"
      });
    }
  }
};
function Login() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "content", "data-light": "", children: [
      /* @__PURE__ */ jsx("h1", { children: "Login" }),
      /* @__PURE__ */ jsxs("form", { method: "post", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "redirectTo",
            value: searchParams.get("redirectTo") ?? void 0
          }
        ),
        /* @__PURE__ */ jsxs("fieldset", { children: [
          /* @__PURE__ */ jsx("legend", { className: "sr-only", children: "Login or Register?" }),
          /* @__PURE__ */ jsxs("label", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "loginType",
                value: "login",
                defaultChecked: !((_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.loginType) || ((_b = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _b.loginType) === "login"
              }
            ),
            " ",
            "Login"
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "loginType",
                value: "register",
                defaultChecked: ((_c = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _c.loginType) === "register"
              }
            ),
            " ",
            "Register"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "username-input", children: "Username" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "username-input",
              name: "username",
              defaultValue: (_d = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _d.username,
              "aria-invalid": Boolean(
                (_e = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e.username
              ),
              "aria-errormessage": ((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.username) ? "username-error" : void 0
            }
          ),
          ((_g = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _g.username) ? /* @__PURE__ */ jsx(
            "p",
            {
              className: "form-validation-error",
              role: "alert",
              id: "username-error",
              children: actionData.fieldErrors.username
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password-input", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password-input",
              name: "password",
              type: "password",
              defaultValue: (_h = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _h.password,
              "aria-invalid": Boolean(
                (_i = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _i.password
              ),
              "aria-errormessage": ((_j = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _j.password) ? "password-error" : void 0
            }
          ),
          ((_k = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _k.password) ? /* @__PURE__ */ jsx(
            "p",
            {
              className: "form-validation-error",
              role: "alert",
              id: "password-error",
              children: actionData.fieldErrors.password
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsx("div", { id: "form-error-message", children: (actionData == null ? void 0 : actionData.formError) ? /* @__PURE__ */ jsx(
          "p",
          {
            className: "form-validation-error",
            role: "alert",
            children: actionData.formError
          }
        ) : null }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "button", children: "Submit" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "links", children: /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/jokes", children: "Jokes" }) })
    ] }) })
  ] });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BZWsvbyV.js", "imports": ["/assets/components-CYces2DZ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-DqBuv4DT.js", "imports": ["/assets/components-CYces2DZ.js"], "css": ["/assets/root-CHSwjTy8.css"] }, "routes/blogs.$blogId": { "id": "routes/blogs.$blogId", "parentId": "routes/blogs", "path": ":blogId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/blogs._blogId-B7AZCAZg.js", "imports": ["/assets/components-CYces2DZ.js"], "css": [] }, "routes/blogs._index": { "id": "routes/blogs._index", "parentId": "routes/blogs", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/blogs._index-DIecPEjA.js", "imports": ["/assets/components-CYces2DZ.js"], "css": [] }, "routes/blogs[.]rss": { "id": "routes/blogs[.]rss", "parentId": "root", "path": "blogs.rss", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/blogs_._rss-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/blogs.new": { "id": "routes/blogs.new", "parentId": "routes/blogs", "path": "new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/blogs.new-DORdC-L2.js", "imports": ["/assets/components-CYces2DZ.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-CmygTyp0.js", "imports": ["/assets/components-CYces2DZ.js"], "css": [] }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/blogs": { "id": "routes/blogs", "parentId": "root", "path": "blogs", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/blogs-gtHkDqbo.js", "imports": ["/assets/components-CYces2DZ.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-dh-VHsGv.js", "imports": ["/assets/components-CYces2DZ.js"], "css": [] }, "routes/test": { "id": "routes/test", "parentId": "root", "path": "test", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/test-DchfTJLH.js", "imports": ["/assets/components-CYces2DZ.js"], "css": [] } }, "url": "/assets/manifest-8712f349.js", "version": "8712f349" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false, "unstable_routeConfig": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/blogs.$blogId": {
    id: "routes/blogs.$blogId",
    parentId: "routes/blogs",
    path: ":blogId",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/blogs._index": {
    id: "routes/blogs._index",
    parentId: "routes/blogs",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/blogs[.]rss": {
    id: "routes/blogs[.]rss",
    parentId: "root",
    path: "blogs.rss",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/blogs.new": {
    id: "routes/blogs.new",
    parentId: "routes/blogs",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/blogs": {
    id: "routes/blogs",
    parentId: "root",
    path: "blogs",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/test": {
    id: "routes/test",
    parentId: "root",
    path: "test",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
