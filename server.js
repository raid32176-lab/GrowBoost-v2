const express=require("express");
const path=require("path");
const app=express(), PORT=process.env.PORT||3000;
const orders=[];
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.post("/api/orders",(req,res)=>{
 const {platform,account,qty}=req.body||{};
 if(!platform||!account||!qty)return res.status(400).json({message:"بيانات الطلب ناقصة."});
 const order={id:"GB-"+Date.now(),platform,account,qty,status:"جديد",createdAt:new Date().toISOString()};
 orders.push(order);
 console.log("NEW ORDER:",JSON.stringify(order));
 res.json({message:`تم استلام طلبك ${order.id}. سيتم تنفيذه يدويًا بعد المراجعة.`});
});

app.get("/admin",(req,res)=>{
 const key=req.query.key;
 if(key!==process.env.ADMIN_KEY)return res.status(403).send("Forbidden");
 res.type("html").send(`<html lang="ar" dir="rtl"><meta charset="utf-8"><title>GrowBoost Admin</title>
 <style>body{font-family:Arial;padding:20px;background:#f4f7fb}table{width:100%;background:white;border-collapse:collapse}td,th{padding:12px;border:1px solid #ddd}</style>
 <h1>لوحة الطلبات</h1><table><tr><th>رقم</th><th>المنصة</th><th>الحساب</th><th>الكمية</th><th>الحالة</th></tr>
 ${orders.map(o=>`<tr><td>${o.id}</td><td>${o.platform}</td><td>${o.account}</td><td>${o.qty}</td><td>${o.status}</td></tr>`).join("")}
 </table></html>`);
});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`GrowBoost running on ${PORT}`));