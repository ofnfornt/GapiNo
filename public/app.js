const stories = ['شما','Nova','Sara','Ali','Mina','Reza','Nika'];
const storyBox = document.querySelector('#stories');
storyBox.innerHTML = stories.map((name,i)=>`<div class="story"><div class="story-avatar"><span>${i===0?'＋':name[0]}</span></div>${name}</div>`).join('');

const feedBox = document.querySelector('#feed');
async function loadFeed(){
  const res = await fetch('/api/feed');
  const posts = await res.json();
  feedBox.innerHTML = posts.map(p=>`<article class="post glass"><div class="post-head"><span class="avatar">${p.avatar}</span><div class="user"><b>${p.name}</b><small>@${p.user}</small></div><button class="more">•••</button></div><img class="post-image" src="${p.image}" alt="post"><p class="caption"><b>${p.user}</b> ${p.caption}</p><div class="actions"><button onclick="like(this)">♡ ${p.likes}</button><button>◌ ${p.comments}</button><button>↗ اشتراک‌گذاری</button><button style="margin-right:auto">▢</button></div></article>`).join('');
}
function like(btn){btn.textContent = btn.textContent.startsWith('♡') ? btn.textContent.replace('♡','♥') : btn.textContent.replace('♥','♡');}
loadFeed();
