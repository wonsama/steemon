const WFILE = require('./libs/WFILE');

// 대상 파일을 읽어들인다 
let res = JSON.parse(WFILE.read('./data.sm'));
res.sort((a,b)=>{
  return Number(b.amount.split(' ')[0]) - Number(a.amount.split(' ')[0]);
});

// 금액 기준으로 정렬 및 출력
let upgrade_cnt = {};
for(let r of res){
  if(r.memo.indexOf('upgrade:')>=0){
    let item = r.memo.split(':')[1];
    if(!upgrade_cnt[item]){
      upgrade_cnt[item] = Number(r.amount.split(' ')[0]);
    }else{
      upgrade_cnt[item] = upgrade_cnt[item] + Number(r.amount.split(' ')[0]);
    }
  }
}
let items = [];
for(let r of Object.entries(upgrade_cnt)){
  items.push({name : r[0], value: r[1]});
}
items.sort((a,b)=>b.value-a.value);

console.log(`|건물명|금액|`);
console.log(`|-|-|`);
for(let item of items){
  // console.log(item.name.padStart(22,' '), item.value.toFixed(3));
  console.log(`|${item.name}|${item.value.toFixed(3)}|`);
}