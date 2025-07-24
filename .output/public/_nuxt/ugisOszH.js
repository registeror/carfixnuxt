const t=(e,r,s)=>{if(e.headers["sec-fetch-mode"]!=="cors")return r.status(403).json({error:"Доступ запрещен"});s()};export{t as default};
