#!/usr/bin/env node

const puppeteer = require("puppeteer")
const readline = require('readline-sync')

let page
let cVideos = 0
let playlistUrl = ''
let secs = 0
let mins = 0
let hrs = 0

// video format:
// only seconds - 0:31
// minutes and seconds - 5:21
// hours, minutes, seconds - 1:40:02

async function fn(){
    try {
        // ask for youtube playlist url
        const playlistUrl = readline.question('paste youtube playlist url: (https://www.youtube.com/playlist?list=ID) \n');
        const browser = await puppeteer
            .launch({
                headless: false,
                defaultViewport: null,
                args: ["--start-maximized"],
            })
        let pages = await browser.pages();
        page = pages[0];

        // go to youtube playlist
        await page.goto(playlistUrl,{waitUntil:"networkidle2"});
        
        
        // noOfVideos of the Playlist 
        await page.waitForSelector("#stats>.style-scope.ytd-playlist-sidebar-primary-info-renderer", { visible: true });
        let noOfVideos = await page.$eval('#stats>.style-scope.ytd-playlist-sidebar-primary-info-renderer:nth-of-type(1)', (el) => el.textContent); 
        noOfVideos = Number(noOfVideos.split(' ')[0])
        
        // first of all we have to scroll down until data finished so that everything rendered successfully
        // then we will extract data.
        // suppose if noOFVideos = 783, page render 100 videos at a time. so we need atleast 7 scrolls (783/100)
        // cVideos = 0 : no of videos rendered till scroll
        let i = 0;
        while ((noOfVideos - cVideos) > 100) {
            await scrollDown(page);
        }
        await waitTillHTMLRendered(page);            // wait for html render before the last scroll
        await scrollDown();                         // 1 more scroll
        

        // now we can go for fetching title and duration from all the videos
        let videoSelector = "#video-title"
        let duration = "span.style-scope.ytd-thumbnail-overlay-time-status-renderer"
        // video title
        await page.waitForSelector("#video-title", { visible: true })
        // video duration
        await page.waitForSelector("span.style-scope.ytd-thumbnail-overlay-time-status-renderer", { visible: true });
        let titleDurArr = await page.evaluate(getTitleNDuration,videoSelector, duration)          // getting title and duration
        console.log('No of videos : '+cVideos)           // no of videos 
        // calculating total secs, total minutes, total hours
        for(let i=0;i<titleDurArr.length;i++){
            let timeArr = titleDurArr[i].duration.split(':')       // 1:52:01 --> 1 and 52 and 1
            timeArr.reverse()                                     
            secs += Number(timeArr[0])
            mins += Number(timeArr[1])
            if(timeArr[2]){                              // if video having hour unit
                hrs += Number(timeArr[2])
            }
        }
        printTimeForSpeed(hrs,mins,secs,1)                  // 1x
        printTimeForSpeed(Math.floor(hrs/1.25),Math.floor(mins/1.25),Math.floor(secs/1.25),1.25)      // 1.25x
        printTimeForSpeed(Math.floor(hrs/1.5),Math.floor(mins/1.5),Math.floor(secs/1.5),1.5)      // 1.5x
        printTimeForSpeed(Math.floor(hrs/1.75),Math.floor(mins/1.75),Math.floor(secs/1.75),1.75)      // 1.75x
        printTimeForSpeed(Math.floor(hrs/2),Math.floor(mins/2),Math.floor(secs/2),2)      // 2x
        console.table(titleDurArr)          // printing whole playlist data
    }
    catch (err) {
        console.log(err)
    }
}

// scroll
async function scrollDown() {
    let length = await page.evaluate(function(){
        let titleElems = document.querySelectorAll("#video-title")   // fetch all rendered videos till that moment.
        titleElems[titleElems.length-1].scrollIntoView(true)      // target the last video and scroll till that video.
        return titleElems.length;
    });
    cVideos = length          // update the cVideos
}

// duration, title array 
function getTitleNDuration(videoSelector,duration) {
    let titleElementsArr = document.querySelectorAll(videoSelector)
    let durationElementArr = document.querySelectorAll(duration)
    let titleDurArr = [];                                          // array of objects of title,duration
    for (let i = 0; i < durationElementArr.length; i++) {
        let title = titleElementsArr[i].innerText;
        let duration = durationElementArr[i].innerText.trim()
        titleDurArr.push({ title, duration })
    }
    return titleDurArr
}

// render html successfully
async function waitTillHTMLRendered(page, timeout = 30000) {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;
    while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length;
        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter
        if (countStableSizeIterations >= minStableSizeIterations) {
            break;
        }
        lastHTMLSize = currentHTMLSize;
        await page.waitForTimeout(checkDurationMsecs);
    }
};

// calculate time for different speed factors
function printTimeForSpeed(hrs,mins,secs,speedFactor){
        let carry = 0
        let dig;
        dig = carry + secs 
        secs = dig%60                  // final seconds
        carry = Math.floor(dig/60)
        dig = carry + mins
        mins = dig%60                    // final minutes
        carry = Math.floor(dig/60)
        dig = carry + hrs
        hrs = dig                      // final hours
        if(speedFactor != 1){
        console.log(`At ${speedFactor}x : : ${hrs} hours, ${mins} minutes, ${secs} seconds`)
        }
        else{
            console.log(`Total length of playlist : ${hrs} hours, ${mins} minutes, ${secs} seconds`)
        }
}

fn()
