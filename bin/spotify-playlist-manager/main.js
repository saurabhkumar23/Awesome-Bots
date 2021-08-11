#!/usr/bin/env node

///////////////////////////////////////////// requires //////////////////////////////////
let fs = require("fs");
let puppeteer = require('puppeteer');
let readline = require('readline-sync');

////////////// variables ///////////////
let newPlaylist;
let modifyPlaylist;
let noOfSongsToAdd;
let noOfSongsToRemove;
let songsToAdd = [];
let songsToRemove = [];
let user;
let pwd;
let operation;
let modifyOperation;

// ask for spotify credentials
user = readline.question('Give your spotify email: ')
pwd = readline.question('Give your spotify password: ',{hideEchoBack: true })
console.log('------------------------------------')

// ask for operation
operation = readline.question('Choose your operation:\n1. Create new playlist and add songs. \n2. Modify your current playlist (add or remove songs from it) \n')
console.log('------------------------------------')
if(operation !=  '1' && operation != '2'){
    console.log('Sorry, we have only these operations available. choose correct option :)')
    process.exit()
}
else if(operation == '1'){
    newPlaylist = readline.question('Give your playlist name: ')
    noOfSongsToAdd = readline.question('How many songs you want to add: ')
    console.log('------------------------------------')
    for(let i=0;i<noOfSongsToAdd;i++){
        songsToAdd[i] = readline.question(`${i+1}. `)
    }
    main();
}
else{
    modifyPlaylist = readline.question('Give your playlist name: ')
    console.log('------------------------------------')
    modifyOperation = readline.question('Choose your operation:\n1. Add new songs. \n2. Remove songs. \n3. Add and Remove both.\n')
    console.log('------------------------------------')
    if(modifyOperation !=  '1' && modifyOperation != '2' && modifyOperation != '3'){
        console.log('Sorry, we have only these operations available. choose correct option :)')
        process.exit()
    }
    else if(modifyOperation == '1'){
        noOfSongsToAdd = readline.question('How many songs you want to add: ')
        console.log('------------------------------------')
        for(let i=0;i<noOfSongsToAdd;i++){
            songsToAdd[i] = readline.question(`${i+1}. `)
        }
        main();
    }
    else if(modifyOperation == '2'){
        noOfSongsToRemove = readline.question('How many songs you want to remove: ')
        console.log('------------------------------------')
        console.log('try to give names exactly mention in your playlist on website.')
        for(let i=0;i<noOfSongsToRemove;i++){
            songsToRemove[i] = readline.question(`${i+1}. `)
        }
        main();
    }
    else{
        noOfSongsToAdd = readline.question('How many songs you want to add: ')
        console.log('------------------------------------')
        for(let i=0;i<noOfSongsToAdd;i++){
            songsToAdd[i] = readline.question(`${i+1}. `)
        }
        console.log('------------------------------------')
        noOfSongsToRemove = readline.question('How many songs you want to remove: ')
        console.log('------------------------------------')
        console.log('try to give names exactly mention in your playlist on website.')
        for(let i=0;i<noOfSongsToRemove;i++){
            songsToRemove[i] = readline.question(`${i+1}. `)
        }
        main();
    }
}

async function main() {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 20,
        args: ['--start-fullscreen', '--disable-notifications', '--incognito']
    });

    let pages = await browser.pages();
    let page = pages[0];

    // enter credentials
    await fillCredentials(page);

    if(operation == '1'){
        await createPlaylist(page);                    // create playlist
        for(let i=0;i<noOfSongsToAdd;i++){
            await addSongToPlaylist(page,songsToAdd[i]);         // add songs
        }
        console.log('done successfully!.')
    }
    else if(modifyOperation == '1'){
        await addSongsToModifyPlaylist(page);          // add songs
        console.log('done successfully!')
    }
    else if(modifyOperation == '2'){
        await removeSongsFromModifyPlaylist(page);        // remove songs
        console.log('done successfully!')
    }
    else{
        await addSongsToModifyPlaylist(page);             // add songs
        console.log('done successfully!')
        await removeSongsFromModifyPlaylist(page);           // remove songs
        console.log('done successfully!')
    }
}

async function fillCredentials(page){
    // open spotify website
    page.goto('https://open.spotify.com', {
        waitUntil: 'networkidle2'
    });

    // Login
    await page.waitForSelector("button[data-testid='login-button']", {
        visible: true     
    });
    await page.click("button[data-testid='login-button']");

    // writing credentials
    await page.waitForSelector('#login-username', {
        visible: true
    });
    await page.type('#login-username', user,{delay:50});
    await page.type('#login-password', pwd,{delay:50});
    await page.click("#login-button");
}

async function createPlaylist(page){
    // create playlist button
    await page.waitForSelector('[data-testid="create-playlist-button"]', {
        visible: true
    });
    await Promise.all([
        page.waitForNavigation(),
        page.click('[data-testid="create-playlist-button"]'),             
    ]);

    // click playlist name
    await page.waitForSelector('h1[as="h1"]',{
        visible: true
    });
    await page.click('h1[as="h1"]')

    // fill playlist name input field
    await page.waitForSelector('[data-testid="playlist-edit-details-name-input"]',{
        visible: true
    });
    await page.click('[data-testid="playlist-edit-details-name-input"]',{clickCount:3});
    await page.type('[data-testid="playlist-edit-details-name-input"]',newPlaylist,{delay:200});

    // save that input field button
    await page.waitForSelector('[data-testid="playlist-edit-details-save-button"]',{
        visible:true
    });
    await page.click('[data-testid="playlist-edit-details-save-button"]');
}

async function addSongToPlaylist(page,song){
    // type song in search bar
    await page.waitForSelector('input[role="searchbox"]',{
        visible:true
    });
    await page.click('input[role="searchbox"]',{clickCount:3})
    await page.type('input[role="searchbox"]',song,{delay:300});

    await page.waitForTimeout(500);

    // add song button
    await page.waitForSelector('button[data-testid="add-to-playlist-button"]',{
        visible:true
    });
    await page.click('button[data-testid="add-to-playlist-button"]');
}

async function addSongsToModifyPlaylist(page){
    // go to search 
    await page.waitForSelector('.icon.search-icon',{
        visible:true
    });
    await Promise.all([
        page.waitForNavigation(),
        page.click('.icon.search-icon'),             
    ]);

    // type your playlist in search bar
    await page.waitForSelector('[role="search"] input',{
        visible:true
    });
    await page.click('[role="search"] input');
    await page.type('[role="search"] input',modifyPlaylist,{delay:300});

    // go to playlist div
    await page.waitForSelector('.L4WROPnQ7MPGhylvVyxd',{
        visible:true
    });
    await page.click('.L4WROPnQ7MPGhylvVyxd');

    // go to 'find more' button
    await page.waitForSelector('.HeBhibwzuyWAXBm9vJlm',{
        visible:true
    });
    await page.click('.HeBhibwzuyWAXBm9vJlm');

    for(let i=0;i<noOfSongsToAdd;i++){
        await addSongToPlaylist(page,songsToAdd[i]);
    }
}

async function removeSongsFromModifyPlaylist(page){
    // go to search 
    await page.waitForSelector('.icon.search-icon',{
        visible:true
    });
    await Promise.all([
        page.waitForNavigation(),
        page.click('.icon.search-icon'),             
    ]);

    // type your playlist in search bar
    await page.waitForSelector('[role="search"] input',{
        visible:true
    });
    await page.click('[role="search"] input');
    await page.type('[role="search"] input',modifyPlaylist,{delay:300});

    // go to playlist div
    await page.waitForSelector('.L4WROPnQ7MPGhylvVyxd',{
        visible:true
    });
    await page.click('.L4WROPnQ7MPGhylvVyxd');

    // make your input array to lowerCase for filtering purpose
    for(let item in songsToRemove){
        songsToRemove[item] = songsToRemove[item].toLowerCase();
    }

    await page.waitForSelector('[data-testid="playlist-tracklist"] .vB_gmMwzmB3GcEliiiys > [role="presentation"] ._gvEBguxvbSruOQCkWrz.standalone-ellipsis-one-line.ipxcyIaAWQfeUHO468Os',{
        visible:true
    });
    let currentSongs = await page.$$eval('[data-testid="playlist-tracklist"] .vB_gmMwzmB3GcEliiiys > [role="presentation"] ._gvEBguxvbSruOQCkWrz.standalone-ellipsis-one-line.ipxcyIaAWQfeUHO468Os', songs => songs.map(song => song.textContent.toLowerCase()));

    for(let i=currentSongs.length-1;i>=0;i--){
        if(songsToRemove.includes(currentSongs[i]) == true){
            await page.waitForTimeout(500);
            await removeSongFromPlaylist(page,i);
        }
    }
}

async function removeSongFromPlaylist(page,index){
    await page.waitForTimeout(500)
    // click 'more' button of that particular song
    await page.waitForSelector(`[data-testid="playlist-tracklist"] .vB_gmMwzmB3GcEliiiys > [role="presentation"] [role="row"]:nth-of-type(${index+1})  [aria-label="More"]`,{
        visible:true
    });
    await page.click(`[data-testid="playlist-tracklist"] .vB_gmMwzmB3GcEliiiys > [role="presentation"] [role="row"]:nth-of-type(${index+1})  [aria-label="More"]`);
    
    await page.waitForTimeout(500);

    // click 'remove from this playlist'
    await page.waitForSelector('#context-menu ul li:nth-of-type(7)');
    await page.click('#context-menu ul li:nth-of-type(7)');
}