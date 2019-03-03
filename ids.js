const WFILE = require('./libs/WFILE');

let json = JSON.parse(WFILE.read('cocina.sm'));

let items = {};

for(let j of json){
	
	let prev = items[j.from];

	if(prev){
		let now = j.amount.split(' ')[0];
		items[j.from] = Math.max(now, prev);
	}else{
		items[j.from] = j.amount.split(' ')[0];
	}
}


let ori = [];

for(let k of Object.entries(items)){
	console.log(k[0], k[1]);

	ori.push({name:k[0], value:k[1]});
}

ori.sort((a,b)=>{
	return b.value - a.value;
});

let str = [];
for(let o of ori){
	str.push(`${o.name.padEnd(16, ' ')}${o.value}`);
}

WFILE.write('out.txt', str.join('\r\n'));