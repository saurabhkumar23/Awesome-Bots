#!/usr/bin/env node

let fs = require("fs")
let path = require("path")
let utility = require("./utility")

// check whether given path is a file or directory
function checkWhetherFile(src){
    return fs.lstatSync(src).isFile()      
}

// get extension of the file path
function getExtension(src){
    let ext = src.split(".").pop()
    return ext
}

// get category based on file extension
function getCategory(ext){
    let types = utility.types
    for (let category in types) {
        for (let i = 0; i < types[category].length; i++) {
            if (ext == types[category][i]) {
                return category
            }
        }
    }
    return "others"
}

// copy the file from src to desired location
function sendFile(dest, category, src) {
    let categoryPath = path.join(dest, category)       // create category directory path
    if (fs.existsSync(categoryPath) == false) {         // if category directory not exists
        fs.mkdirSync(categoryPath)                  // create category directory
    }
    let fName = path.basename(src)              // returns the filename part of a file path.
    let cPath = path.join(categoryPath, fName)    // create the destination path
    fs.copyFileSync(src, cPath)                 
}

// get content of the directory path
function getContent(src) {
    return fs.readdirSync(src)   // return the contents of a given directory as an array
}

// MAIN FUNCTION
function organizer(src, dest) {
    if(checkWhetherFile(src) == true){    // if path is a file
        let ext = getExtension(src)        // get extension of the file
        let category = getCategory(ext)    // get category of the file
        sendFile(dest, category, src)      // copy file from src to dest
    }
    else{                                  // if path is a directory
        let childNames = getContent(src)     // get content of the directory
        for (let i = 0; i < childNames.length; i++) {
            if (childNames[i] == "organized_files") {    // ignoring the dest directory
                continue;
            }
            let childPath = path.join(src, childNames[i])
            organizer(childPath, dest)             // recursively organise for directory content
        }
    }
}

let src = process.argv[2]||process.cwd()             // cwd path
let dest = path.join(src,"organized_files")          // create des directory path

if (fs.existsSync(dest) == false){          // if des directory not exists
    fs.mkdirSync(dest)                    // create des directory
}

organizer(src,dest)