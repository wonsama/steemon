const steem = require('steem');
const dateformat = require('dateformat');

const BLOCK_PER_READ = 1000;
const DEF_SLEEP_SEC = 1000 * 3;

const fn = {};

fn.getDate = timestamp => new Date(`${timestamp}.000Z`);
fn.getDateStr = timestamp => dateformat( fn.getDate(timestamp), 'yyyy-mm-dd HH:MM:sss' );


/*
* 최신 블록 번호를 STEEM 노드에서 가져온다
* @param isHead 헤드블록인지 여부
* @return 블록번호
*/
fn.get_last_block_number = async (isHead=true) => {
    return steem.api.getDynamicGlobalPropertiesAsync()
    .then(x=>isHead?x.head_block_number:x.last_irreversible_block_num)
    .catch(err=>{error:err});
}

/*
* 범위 내의 블록 정보를 반환한다
* @param sblock 시작 블록번호
* @param eblock 종료 블록번호
* @return 블록정보
*/
fn.get_blocks = async (sblock, eblock) => {

    if(sblock && eblock){
        let list = [];
        for(let i=sblock;i<=eblock;i++){
            list.push(steem.api.getBlockAsync(i));
        }

        // 단건, 다건 구분
        let res = await Promise.all(list);
        if(!Array.isArray(res)){
            return Promise.resolve( [res] );
        }
        return res;

    }else if(sblock){
        // 단건
        return [await steem.api.getBlockAsync(sblock)];
    }else{
        // not matched
        return Promise.reject({error:`${sblock} is empty`});
    }
}

/*
* 블록 정보에서 거래 정보를 추출한다 
* @param blocks 블록정보 
* @return 거래정보 
*/
fn.get_trans_from_block = async (blocks) => {

    let items = [];

    if(!blocks || !Array.isArray(blocks) ){
        return Promise.reject({error:`block is empty or not iterable`});
    }

    for(let b of blocks){
        if(b && b.transactions){
            for(let t of b.transactions){
                if(t && t.operations){
                    for(let o of t.operations){
                        let item = {};
                        item.timestamp = b.timestamp;
                        item.block_num = t.block_num;
                        item.transaction_num = t.transaction_num;
                        item.transaction_id = t.transaction_id;
                        item.operation = o;
                        items.push(item);
                    }
                }
            }
        }
    }
    return Promise.resolve(items);
}

/*
* 커맨드 목록 기준으로 operations를 필터링 한다
* @param ops 오퍼레이션 목록
* @cmds 커맨드목록
* @return 필터링된 커맨드 목록
*/
fn.get_filtered_by_command = async (ops, cmds) => {

    if(!Array.isArray(cmds)){
        cmds = [cmds];
    }

    ops = ops.filter(x=>cmds.includes(x.operation[0]));

    let items = [];
    for(let o of ops){
        items.push({
            timestamp : o.timestamp,
            block_num : o.block_num,
            transaction_num : o.transaction_num,
            transaction_id : o.transaction_id,
            cmd : o.operation[0],
            operation : o.operation[1]
        });
    }
    return Promise.resolve(items);
}

/*
* 모니터링을 수행한다
* @param cmds 모니터링할 커맨드 목록
* @param cb 수신 결과를 모니터링할 콜백
* @param sblock 모니터링을 시작할 블록넘버
*/
fn.on = async (cmds, cb, sblock)=>{

    let eblock;
    try{
        eblock = await fn.get_last_block_number();

        // 시작 블록 정보가 BLOCK_PER_READ(기본 1000) 이상 차이나는 경우 처리
        if(sblock && sblock + BLOCK_PER_READ < eblock){
            eblock = sblock + BLOCK_PER_READ;
        }
    }catch(e){
        // 일반적으로 네트워크 오류임 / 다시 시작
        return fn.on(cmds, cb, sblock);
    }

    // 이미 읽어들인 정보인 경우임
    if(sblock && sblock>=eblock){
        return fn.on(cmds, cb, sblock);
    }

    // 시작 블록 미설정한 경우, 마지막 블록으로 설정
    if(!sblock){
        sblock = eblock;
    }
    
    // 시작 => 마지막 블록 번호 얻기  => 거래정보 추출 => 커맨드 명 기준 필터링 => 결과 알려주기(콜백) , 다시 첨부터 ...
    fn.get_blocks(sblock, eblock)
    .then(res=>fn.get_trans_from_block(res))
    .then(res=>fn.get_filtered_by_command(res, cmds))
    .then(res=>{
        // 결과를 콜백으로 알려준다 
        cb(res);

        // 다음 결과를 모니터링 수행
        setTimeout(()=>{
            // 다음에 읽어들일 블록 정보 update
            sblock = eblock + 1;
            return fn.on(cmds, cb, sblock);
        }, DEF_SLEEP_SEC );
    });
}

/*
* 해당 블록이 생성된 시간 정보를 반환한다
*/
fn.get_block_time = block => {
    return fn.get_blocks(block).then(res=>{
        return Promise.resolve(fn.getDateStr(res[0].timestamp));
    });
}

module.exports = fn;