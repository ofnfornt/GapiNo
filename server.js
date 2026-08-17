import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'gapino-secret';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok:true, app:'GapiNo', database: !!process.env.DATABASE_URL });
});

app.post('/api/register', async (req,res)=>{
  try {
    const {username,email,password}=req.body;
    const hash=await bcrypt.hash(password,10);
    const result=await pool.query('INSERT INTO users(username,email,password_hash) VALUES($1,$2,$3) RETURNING id,username,email',[username,email,hash]);
    res.json(result.rows[0]);
  } catch(e){ res.status(400).json({error:e.message}); }
});

app.post('/api/login', async(req,res)=>{
  try{
    const {email,password}=req.body;
    const result=await pool.query('SELECT * FROM users WHERE email=$1',[email]);
    if(!result.rows[0]) return res.status(401).json({error:'Invalid login'});
    const ok=await bcrypt.compare(password,result.rows[0].password_hash);
    if(!ok) return res.status(401).json({error:'Invalid login'});
    const token=jwt.sign({id:result.rows[0].id},JWT_SECRET);
    res.json({token});
  }catch(e){res.status(500).json({error:e.message})}
});

app.get('/api/feed', async (_req,res)=>{
 try{
  const posts=await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 50');
  res.json(posts.rows);
 }catch(e){res.json([])}
});

app.post('/api/posts', async(req,res)=>{
 try{
  const {user_id,image_url,caption}=req.body;
  const post=await pool.query('INSERT INTO posts(user_id,image_url,caption) VALUES($1,$2,$3) RETURNING *',[user_id,image_url,caption]);
  res.json(post.rows[0]);
 }catch(e){res.status(400).json({error:e.message})}
});

app.get('/*splat', (_req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));

app.listen(PORT,'0.0.0.0',()=>console.log(`GapiNo running ${PORT}`));
