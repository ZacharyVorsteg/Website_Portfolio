const fs=require('node:fs');const path=require('node:path');const {spawn}=require('node:child_process');const {once}=require('node:events');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=__dirname;const FPS=24,DURATION=21;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage({viewport:{width:720,height:1280},deviceScaleFactor:1});
 await page.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
 await page.goto('file://'+path.join(out,'explainer.html'));await page.evaluate(()=>document.fonts.ready);
 for(const [name,time]of [['poster',1],['scene-workflow',8.4],['scene-accountability',13.5],['scene-invitation',18.8]]){
  await page.evaluate(t=>renderAt(t),time);await page.screenshot({path:path.join(out,name+'.png')});
 }
 const ffmpeg=spawn(process.env.FFMPEG_PATH||'ffmpeg',['-hide_banner','-loglevel','warning','-y','-f','image2pipe','-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-crf','26','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'one-bottleneck.mp4')],{stdio:['pipe','inherit','inherit']});
 const completion=once(ffmpeg,'close');
 for(let frame=0;frame<FPS*DURATION;frame++){
  await page.evaluate(t=>renderAt(t),frame/FPS);const buffer=await page.screenshot();
  if(!ffmpeg.stdin.write(buffer))await once(ffmpeg.stdin,'drain');
  if(frame%120===0)process.stdout.write(`Rendered ${frame}/${FPS*DURATION} frames\n`);
 }
 ffmpeg.stdin.end();const[code]=await completion;await browser.close();if(code!==0)throw new Error('ffmpeg exit '+code);
 process.stdout.write(JSON.stringify({frames:FPS*DURATION,duration:DURATION,bytes:fs.statSync(path.join(out,'one-bottleneck.mp4')).size})+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
