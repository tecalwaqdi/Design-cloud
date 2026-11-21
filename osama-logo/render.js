const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
for(const d of process.argv.slice(2)){await p.goto('file://'+path.resolve(__dirname,'src',d+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:path.resolve(__dirname,'output',d+'.png')});}
await b.close()})();
