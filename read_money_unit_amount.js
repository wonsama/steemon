const WFILE = require('./libs/WFILE');

let res = JSON.parse(WFILE.read('./data.sm'));
res.sort((a,b)=>{
  return Number(b.amount.split(' ')[0]) - Number(a.amount.split(' ')[0]);
});
/*
{ from: 'v4vapid',
  to: 'drugwars-dealer',
  amount: '163.399 STEEM',
  memo: 'unit:bouncer,amount:1000' }
*/

console.log(`|구매자|유닛|수량|금액|`);
console.log(`|-|-|-|-|`);
let memos = [];
for(let r of res){
  if(r.memo.indexOf('amount')>0){

    let m = r.memo.split(',');
    let unit = m[0].split(':')[1];
    let amount = m[1].split(':')[1];
    let steem_amount = r.amount.split(' ')[0];

    console.log( `|${r.from}|${unit}|${amount}|${steem_amount}|`);
  }
}