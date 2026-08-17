const ws = new WebSocket(location.origin.replace('http','ws'));
const box=document.getElementById('messages');
ws.onmessage=e=>{const d=JSON.parse(e.data);box.innerHTML += `<p><b>${d.user||'System'}:</b> ${d.message}</p>`};
function send(){const i=document.getElementById('input');ws.send(i.value);i.value='';}