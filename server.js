const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
const server=http.createServer((req,res)=>{let u=new URL(req.url,'http://localhost'); let p=decodeURIComponent(u.pathname); if(p==='/' )p='/index.html'; let file=path.normalize(path.join(root,p)); if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end('Not found')};res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain; charset=utf-8','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res)});
const port=process.env.PORT||3000;server.listen(port,()=>console.log(`WATERLINE running at http://localhost:${port}`));
