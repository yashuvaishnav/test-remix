import{c as u,j as r,F as a,b as c,i as x,L as b}from"./components-CYces2DZ.js";const h=()=>{var o,s,l,d,n,t,i,m;const e=u();return r.jsxs("div",{children:[r.jsx("h1",{className:"text-[32px] text-gray-400 font-bold",children:"Add Blogs"}),r.jsx(a,{method:"post",children:r.jsxs("div",{className:"space-y-4",children:[r.jsxs("div",{children:[r.jsxs("label",{className:"block text-gray-700 font-medium mb-1",children:["Name:",r.jsx("input",{defaultValue:(o=e==null?void 0:e.fields)==null?void 0:o.name,type:"text",name:"name","aria-invalid":!!((s=e==null?void 0:e.fieldErrors)!=null&&s.name),"aria-errormessage":(l=e==null?void 0:e.fieldErrors)!=null&&l.name?"name-error":void 0,className:"w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"})]}),(d=e==null?void 0:e.fieldErrors)!=null&&d.name?r.jsx("p",{className:"form-validation-error text-red-500",id:"name-error",role:"alert",children:e.fieldErrors.name}):null]}),r.jsxs("div",{children:[r.jsxs("label",{className:"block text-gray-700 font-medium mb-1",children:["Content:",r.jsx("textarea",{defaultValue:(n=e==null?void 0:e.fields)==null?void 0:n.content,name:"content","aria-invalid":!!((t=e==null?void 0:e.fieldErrors)!=null&&t.content),"aria-errormessage":(i=e==null?void 0:e.fieldErrors)!=null&&i.content?"content-error":void 0,className:"w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"})]}),(m=e==null?void 0:e.fieldErrors)!=null&&m.content?r.jsx("p",{className:"form-validation-error text-red-500",id:"content-error",role:"alert",children:e.fieldErrors.content}):null]}),r.jsx("div",{children:r.jsx("button",{type:"submit",className:"w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600",children:"Add"})})]})})]})};function p(){const e=c();return console.log(e),x(e)&&e.status===401?r.jsxs("div",{className:"error-container p-4 rounded-md shadow-lg border-t-2",children:[r.jsx("p",{className:"mb-[20px]",children:"You must be logged in to create a joke."}),r.jsx(b,{to:"/login",className:"text-blue-500 font-semibold border-2 border-blue-500 py-[7px] px-[15px] rounded-md mt-[20px] hover:text-blue-700 hover:border-blue-700",children:"Login"})]}):r.jsx("div",{className:"error-container",children:"Something unexpected went wrong. Sorry about that."})}export{p as ErrorBoundary,h as default};
