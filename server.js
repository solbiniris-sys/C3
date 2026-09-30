// 방 상태를 파일로 저장하는 최소 서버. Railway Volume을 쓰면 DATA_DIR=/data 로 지정하세요.
const express=require('express'),fs=require('fs'),path=require('path');
const app=express();app.use(express.json({limit:'2mb'}));
const DIR=process.env.DATA_DIR||path.join(__dirname,'saves');fs.mkdirSync(DIR,{recursive:true});
const file=c=>path.join(DIR,String(c).replace(/[^\w가-힣-]/g,'_')+'.json');
const read=c=>{try{return JSON.parse(fs.readFileSync(file(c)))}catch{return null}};
app.get('/api/room/:c',(q,r)=>{const s=read(q.params.c);if(!s)return r.status(404).json({});
  if(q.query.v&&+q.query.v===s.v)return r.json({same:true});r.json(s)});
app.put('/api/room/:c',(q,r)=>{const cur=read(q.params.c),{v,state}=q.body;
  if((cur?cur.v:0)!==v)return r.status(409).json(cur||{});
  state.v=v+1;fs.writeFileSync(file(q.params.c),JSON.stringify(state));r.json(state)});
const slotFile=(c,n)=>file(c).replace(/\.json$/,`__slot${+n}.json`);
app.get('/api/room/:c/slots',(q,r)=>{const o={};[1,2,3].forEach(n=>{try{const s=JSON.parse(fs.readFileSync(slotFile(q.params.c,n)));o[n]={day:s.day||1,ch:s.ch}}catch{}});r.json(o)});
app.post('/api/room/:c/slot/:n',(q,r)=>{const s=read(q.params.c);if(!s)return r.sendStatus(404);fs.writeFileSync(slotFile(q.params.c,q.params.n),JSON.stringify(s));r.json({ok:1})});
app.post('/api/room/:c/load/:n',(q,r)=>{const cur=read(q.params.c);let s;try{s=JSON.parse(fs.readFileSync(slotFile(q.params.c,q.params.n)))}catch{return r.sendStatus(404)}s.v=(cur?cur.v:0)+1;fs.writeFileSync(file(q.params.c),JSON.stringify(s));r.json({ok:1})});
app.use(express.static(path.join(__dirname,'public')));
app.listen(process.env.PORT||3000,()=>console.log('WATERLINE up'));
